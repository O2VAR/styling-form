package net.creasource

import java.io.File

import akka.Done
import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Sink
import net.creasource.audio._

import scala.concurrent.{Await, Future}

class TagExtractorTest extends SimpleTest {

  "A LibraryScanner" should {

    "find audio files in a folder" in {

      //val scanner = new LibraryScanner(new File("D:\\Musique\\Metallica"))

      //val files = scanner.getAudioFiles(new File("C:\\Users\\Thomas\\Workspace\\musicalypse\\web\\src\\assets\\music"))
      //files.foreach(println)
      //val metas = scann