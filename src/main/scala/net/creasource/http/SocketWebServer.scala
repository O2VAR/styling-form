package net.creasource.http

import akka.Done
import akka.actor.{ActorRef, Props, Status}
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.pattern.ask
import akka.stream.{KillSwitches, OverflowStrategy, SharedKillSwitch}
import akka.stream.scaladsl.{Flow, Keep, Sink, Source}

import scala.concurrent.Future
import scala.concurrent.duration._
import net.creasource.http.actors.{SocketSinkActor, SocketSinkSupervisor}

/**
  * A WebServer that supports WebSockets connections on the path /socket.
  * Concrete classes must define a socketActorProps that will receive socket messages.
  */
trait SocketWebServer extends WebServer { self: WebServer =>

  protected val socketActorProps: Props

  private lazy v