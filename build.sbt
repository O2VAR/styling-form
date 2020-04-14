import com.typesafe.sbt.packager.windows.{AddShortCuts, WindowsFeature}
import NativePackagerHelper._
import scala.sys.process._

import scala.sys.process.Process

lazy val akkaHttpVersion = "10.1.5"
lazy val akkaVersion    = "2.5.18"

//val ng = inputKey[Int]("The angular-cli command.")
//val ngBuild = taskKey[Int]("ng build -prod -