package net.creasource.http.actors

import akka.actor.{Actor, ActorRef, OneForOneStrategy, Props, Stash, Status, SupervisorStrategy, Terminated}
import akka.event.Logging
import akka.http.scaladsl.model.ws.{BinaryMessage, TextMessage}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Sink

import spray.json._

import scala.concurrent.duration._

object SocketSinkActor {
  def