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
    implicit val jsonMessageFormat: RootJsonFormat[JsonMessage] = jsonFormat3(JsonMessage.apply)
    implicit val httpHeaderWriter: RootJsonWriter[HttpHeader] = (obj: HttpHeader) => {
      JsObject(
        "name" -> JsString(obj.name()),
        "value" -> JsString(obj.value())
      )
    }
    implicit val httpResponseFormat: RootJsonWriter[HttpResponse] = (obj: HttpResponse) => JsObject(
      "status" -> JsNumber(obj.status.intValue),
      "statusText" -> JsString(obj.status.reason),
      "entity" -> (obj.entity match {
        case HttpEntity.Strict(ct@ContentTypes.`application/json`, body) => JsonParser(body.decodeSt