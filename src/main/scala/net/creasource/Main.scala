package net.creasource

import akka.actor.{ActorSystem, Props}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import net.creasource.core.Application
import net.creasource.http.{SPAWebServer, SocketWebServer}
import net.creasource.web._

import scala.io.StdIn

/**
  * The Main class that bootstraps the application.
  */
object Main extends App with SPAWebServer with SocketWebServer {

  implicit val app: Application = Application()

  private val host = app.config.getString("http.host")
  private val port = app.config.getInt("http.port")
  private val stopOnReturn = app.config.getBoolean("http.stop-on-return")

  private val apiRoutes = new APIRoutes(app)
  private val libraryRoutes = new AudioLibraryRoutes(app)

