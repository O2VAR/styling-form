package net.creasource

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model._
import akka.util.ByteString
import spray.json._

import scala.util.Try

package object web {

  case class JsonMessage(method: String, id: Int, entity: JsValue)

  object Json