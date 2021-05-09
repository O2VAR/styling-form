package net.creasource.core

import akka.actor.{ActorRef, ActorSystem}
import akka.stream.ActorMaterializer
import com.typesafe.config.{Config, ConfigFactory}
import net.creasource.web.{LibraryActor, LyricsActor, SettingsActor}

import scala.concurrent.Await

object Application {

  def apply() = new Application

}

/**
  * Represents an application. This is where you'll instantiate your top actors, connect to a database, etc...
  */
class App