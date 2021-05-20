package net.creasource.http.actors

import akka.actor.{Actor, ActorRef, OneForOneStrategy, Props, Stash, Status, SupervisorStrategy, Terminated}
import akka.event.Logging
import akka.http.scaladsl.model.ws.{BinaryMessage, TextMessage}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.Sink

import spray.json._

import scala.concurrent.duration._

object SocketSinkActor {
  def props(socketActorProps: Props)(implicit materializer: ActorMaterializer): Props = Props(new SocketSinkActor(socketActorProps))
}

class SocketSinkActor(socketActorProps: Props)(implicit materializer: ActorMaterializer) extends Actor with Stash {
  private val logger = Logging(context.system, this)

  logger.debug("Socket opened. Actor created.")

  override def receive: Receive = {
    case sourceActor: ActorRef =>
      val user = context.watch(context.actorOf(socketActorProps, "user"))
      unstashAll()
      context.become {
        case TextMessage.Strict(data)        => user ! JsonParser(data)
        case BinaryMessage.Strict(_)         => // ignore
        case TextMessage.Streamed(stream)    => stream.runWith(Sink.ignore)
        case BinaryMessage.Streamed(stream)  => stream.runWith(Sink.ignore)
        case msg: JsValue if sender() == user => sourceActor ! TextMessage(msg.compactPrint)
        case Terminated(`user`) =>
