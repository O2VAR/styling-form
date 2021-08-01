package net.creasource

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model._
import akka.util.ByteString
import spray.json._

import scala.util.Try

package object web {

  case class JsonMessage(method: String, id: Int, entity: JsValue)

  object JsonMessage extends JsonSupport {
    def unapply(arg: JsValue): Option[(String, Int, JsValue)] = {
      Try(arg.convertTo[JsonMessage]).toOption.map(m => (m.method, m.id, m.entity))
    }
  }

  trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
   