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
      "com.typesafe.akka" %% "akka-http"            % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-xml"        % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-stream"          % akkaVersion,
      "com.typesafe.akka" %% "akka-actor"           % akkaVersion,
      "com.typesafe.akka" %% "akka-slf4j"           % akkaVersion,
      "ch.qos.logback"    %  "logback-classic"      % "1.2.3",
      "com.mpatric"       %  "mp3agic"              % "0.9.1",
      "net.jthink"        %  "jaudiotagger"         % "2.2.3",

      "com.typesafe.akka" %% "akka-http-testkit"    % akkaHttpVersion % Test,
      "com.typesafe.akka" %% "akka-testkit"         % akkaVersion     % Test,
      "com.typesafe.akka" %% "akka-stream-testkit"  % akkaVersion     % Test,
      "org.scalatest"     %% "scalatest"            % "3.0.4"         % Test
    ),
    unmanagedResourceDirectories in Compile += baseDirectory.value / "config",
    unmanagedResourceDirectories in Compile += target.value / "dist",
//    ng := {
//      import complete.DefaultParsers._
//      val args = spaceDelimited("<arg>").parsed.mkString(" ")
//      val command = {
//        if (System.getProperty("os.name").toLowerCase().contains("win")) {
//          s"powershell -Command ng $args"
//        } else {
//          s"ng $args"
//        }
//      }
//      Process(command, new File(".").getAbsoluteFile).!
//    },
//    ngBuild := {
//      val log = streams.value.log
//      log.info("Building Angular application...")
//      val command = {
//        if (System.getProperty("os.name").toLowerCase().contains("win")) {
//          s"powershell -Command ng build -prod -aot"
//        } else {
//          s"ng build -prod -aot"
//        }
//      }
//      