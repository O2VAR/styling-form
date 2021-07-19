
package net.creasource.web

import java.io._
import java.nio.file._

import akka.actor.{Actor, ActorRef, Props, Stash, Terminated}
import akka.event.Logging
import akka.stream.IOResult
import akka.stream.scaladsl.{Flow, Framing, Sink, Source, StreamConverters}
import akka.util.ByteString
import akka.{Done, NotUsed}
import net.creasource.audio.TagExtractor.{getMetadata, getMetadata2}
import net.creasource.core.Application
import net.creasource.io._
import net.creasource.model.{AlbumCover, Track, TrackMetadata}
import net.creasource.web.LibraryActor._
import spray.json._

import scala.collection.immutable.Seq
import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.{Failure, Success, Try}

object LibraryActor {

  case object Register
  case class NewTracks(track: Seq[Track])
  case class DeletedTracks(track: Seq[Track])
  case class Notify[T](message: T)(implicit val writer: JsonWriter[T])

  case object ScanLibrary
  case object GetTracks
  case object GetLibraries
  case class Libraries(libraries: Seq[Path])

  case class AddLibrary(library: String)
  case class RemoveLibrary(library: String)

  sealed trait LibraryChangeResult
  case object LibraryChangeSuccess extends LibraryChangeResult
  case class LibraryChangeFailed(reason: String) extends LibraryChangeResult

  def props()(implicit application: Application): Props = Props(new LibraryActor())

}

class LibraryActor()(implicit application: Application) extends Actor with Stash with JsonSupport {

  import application.materializer
  import context.dispatcher

  private case class SetLibraries(libraries: Seq[Path])
  private case class SetTracks(tracks: Seq[Track])
  private case class AddTrack(track: Track, broadcast: Boolean = false)
  private case object MarkForSaving
  private case object WriteTracksFile
  private case class NotifyListeners[T](message: T)(implicit val writer: JsonWriter[T])
  // private case object CheckTracks

  private val logger = Logging(context.system, this)

  var tracks: Seq[Track] = _
  var libraries: Seq[Path] = _
  var listeners: Seq[ActorRef] = Seq.empty

  // val uploadFolder: String = application.config.getString("music.uploadFolder")

  val cacheFolder: Path = Paths.get(application.config.getString("music.cacheFolder"))
  val coversFolder: Path = cacheFolder.resolve("covers")
  val tracksFile: File = cacheFolder.resolve("tracks.v1.json").toFile
  val librariesFile: File = cacheFolder.resolve("libraries.json").toFile

  val watchActor: ActorRef = context.actorOf(WatchActor.props, "WatchService")

  var markedForSaving = false
  application.system.scheduler.schedule(2.seconds, 2.seconds, self, WriteTracksFile)

  val isFirstLaunch: Boolean = !librariesFile.exists()

  override def preStart(): Unit = {
    coversFolder.toFile.mkdirs()

    if (isFirstLaunch) {
      logger.info("First launch")
      self ! NotifyListeners("First_Launch")
    }

    logger.info("Loading libraries...")
    val initF = for {
      l0 <- loadLibraries()
      _  = logger.info(l0.length + " libraries have been loaded")
      _  = logger.info("Filtering libraries...")
      l1 = l0.filter(lib => lib.toFile.isDirectory)
      _  = logger.info(l0.length - l1.length + " libraries have been removed.")
      _  = logger.info("Saving libraries to file...")
      _  <- saveLibraries(l1)
      _  = self ! SetLibraries(l1)
      _  = logger.info("Loading tracks...")
      t0 <- loadTracks()
      _  = logger.info(t0.length + " tracks have been loaded.")
      _  = logger.info("Filtering tracks...")
      t1 = t0.filter(t => l1.exists(lib => t.location.startsWith(lib.toString)))
      t2 = t1.filter(t => new File(t.location).exists)
      _  = logger.info(t0.length - t2.length + " tracks have been removed.")
      t3 <- if (isFirstLaunch || t0.isEmpty) {
              logger.info("First launch detected. Skipping looking for new tracks.")
              Future.successful(t2)
            } else {
              logger.info("Looking for new tracks...")
              loadNewTracks(t2, l1)
            }
      _  = logger.info(t3.length - t2.length + " tracks have been added.")
      _  = logger.info("Saving tracks to file...")
      _  <- saveTracks(t3)
      _  = self ! SetTracks(t3)
      _  = logger.info("Watching library folders...")
      _  <- watchLibraryFolders(l1)
    } yield Done

    initF.onComplete {
      case Success(Done) => logger.info("Initialization successful.")
      case Failure(t) => logger.error(t, "Error initializing LibraryActor!")
    }

  }

  def receive: Receive = {

    case SetLibraries(l) =>
      libraries = l
      unstashAll()

    case SetTracks(t) =>
      tracks = t
      unstashAll()

    case GetLibraries =>
      if (libraries == null) {
        stash()
      } else {
        sender ! Libraries(libraries)
      }

    case GetTracks =>
      if (tracks == null) {
        stash()
      } else {
        sender() ! tracks
      }

    case Register =>
      val listener = sender()
      listeners +:= listener
      context.watch(listener)
      logger.debug("Listener registered: " + listener)
      unstashAll()

    case Terminated(listener) =>
      listeners = listeners diff List(listener)
      logger.debug("Listener unregistered: " + listener)

    case notify @ NotifyListeners(message) =>
      implicit val writer: JsonWriter[Any] = notify.writer
      if (listeners.isEmpty) {
        stash()
      } else {
        listeners.foreach(listener => listener ! Notify(message))
      }

    case MarkForSaving => markedForSaving = true

    case WriteTracksFile =>
      if (markedForSaving) {
        logger.debug("Tracks have been marked for saving.")
        saveTracks(tracks)
        markedForSaving = false
      }

    case AddLibrary(library) =>
      Try(Paths.get(library)) match {
        case Success(lib) =>
          if (libraries.contains(lib)) {
            sender() ! LibraryChangeFailed(s"'$lib' is already a library folder")
          } else {
            if (lib.toFile.isDirectory && lib.toFile.canRead) {
              logger.info(s"Adding library: $lib")
              val client = sender()
              libraries +:= lib.toAbsolutePath
              val result = for {
                _ <- saveLibraries(libraries)
                _ <- watchLibraryFolders(Seq(lib.toAbsolutePath))
              } yield Done
              result.onComplete {
                case Success(Done) => client ! LibraryChangeSuccess
                case Failure(t) => client ! LibraryChangeFailed(s"An error occurred: ${t.getMessage}")
              }
            } else {
              sender() ! LibraryChangeFailed(s"'$lib' is not a directory or cannot be read")
            }
          }
        case Failure(_) => sender() ! LibraryChangeFailed(s"'$library' is not a valid path")
      }

    case RemoveLibrary(library) =>
      Try(Paths.get(library).toAbsolutePath) match {
        case Success(lib) =>
          if (libraries.contains(lib)) {
            val client = sender()
            logger.info(s"Removing library: $lib")
            libraries = libraries diff List(lib)
            val result = for {
              _ <- saveLibraries(libraries)
              _ = logger.info("Computing tracks to remove...")
              deletedTracks = tracks.filter(track => track.location.startsWith(lib.toString))
              _ = logger.info(deletedTracks.length + " tracks are to be removed")
              remainingTracks = tracks diff deletedTracks
              _ = self ! SetTracks(remainingTracks)
              _ = logger.info(s"Broadcasting to ${listeners.length} listeners.")
              _ = listeners.foreach(_ ! DeletedTracks(deletedTracks))
              _ = logger.info("Saving tracks")
              _ <- saveTracks(remainingTracks)
            } yield Done
            result.onComplete {
              case Success(Done) => client ! LibraryChangeSuccess
              case Failure(t) => client ! LibraryChangeFailed(s"An error occurred: ${t.getMessage}")
            }
          } else {
            // Succeed even though the library folder was unknown
            sender() ! LibraryChangeSuccess
          }
        case Failure(_) => sender() ! LibraryChangeFailed(s"$library is not a valid path.")
      }

    case ScanLibrary =>
      import context.dispatcher
      tracks = Seq.empty
      val a: Source[Track, NotUsed] = getTrackSource