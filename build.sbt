import com.typesafe.sbt.packager.windows.{AddShortCuts, WindowsFeature}
import NativePackagerHelper._
import scala.sys.process._

import scala.sys.process.Process

lazy val akkaHttpVersion = "10.1.5"
lazy val akkaVersion    = "2.5.18"

//val ng = inputKey[Int]("The angular-cli command.")
//val ngBuild = taskKey[Int]("ng build -prod -aot.")
//val jreMappings = taskKey[Seq[(File, String)]]("JRE Mappings for Universal plugin")
//val launch4j = taskKey[Int]("launch4j")
//val Deploy = config("deploy")

lazy val root = (project in file(".")).
  settings(
    name            := "Musicalypse",
    version         := "1.0.0",
    licenses        := Seq("MIT" -> new URL("https://choosealicense.com/licenses/mit/")),
    organization    := "net.creasource",
    scalaVersion    := "2.12.8",
    scalacOptions   := Seq("-unchecked", "-deprecation", "-feature"),
    resolvers       += "jaudiotagger-repository" at "https://dl.bintray.com/ijabz/maven",
    libraryDependencies ++= Seq(
      "com.typesa