package net.creasource.io

/**
  * This file is copy/pasted from https://github.com/nurkiewicz/learning-akka
  * It is released under the Apache 2 License (https://github.com/nurkiewicz/learning-akka/blob/master/license.txt)
  * Substantial modifications have been made, including changing the package name, and fixing the code for fast copy.
  */

import java.io.UncheckedIOException
import java.nio.file.StandardWatchEventKinds._
import java.nio.file._

import akka.Done
import akka.actor.ActorRef
import akka.event.LoggingAdapter
import akka.stream.Materializer
import akka.stream.scaladsl.{Sink, StreamConverters}

import scala.collection.JavaConverters._
import scala.concurrent.Future

class WatchService(notifyActor: ActorRef, logger: LoggingAdapter)(implicit materializer: Materializer) extends Runnable {

  private val watchService = FileSystems.getDefault.newWatchService()

  private def register(path: Path): WatchKey = path.register(watchService, ENTRY_CREATE, ENTRY_DELETE)

  def watch(root: Path): Future[Done] = {
    logger.debug("Watching folder: " + root)
    register(root)
    StreamConverters
      .fromJavaStream(() => Files.walk(root))
      .recover {
        case _: UncheckedIOException => root
      }
      .runWith(Sink.foreach(path =>
        if (path.toFile.isDirectory && path != root) {
          logger.debug("Registering folder: " + path)
          register(path)
        }
