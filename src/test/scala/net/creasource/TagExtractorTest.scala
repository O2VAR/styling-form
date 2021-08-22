package net.creasource

import java.io.File

import akka.Done
import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Sink
import net.creasource.audio._

import scala.concurrent.{Await, Future}

class TagExtractorTest extends SimpleTest {

  "A LibraryScanner"