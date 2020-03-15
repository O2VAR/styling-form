
# Musicalypse

Musicalypse is a modern audio player built with web technologies.
It is available as an online or native version on main desktop platforms
and provides a backend streaming server.

Developed in [Typescript](https://www.typescriptlang.org/) and [Scala](https://www.scala-lang.org/) using [Angular](https://angular.io/) and [akka](https://akka.io/).

Provided as a seemingly native application using [electron](https://electronjs.org/).

Find out more on [the official website](https://musicalypse.creasource.net).

![GitHub All Releases](https://img.shields.io/github/downloads/tgambet/musicalypse/total.svg?style=flat-square)

## Features

* Supports mp3, ogg, flac and wav
* Streaming server for your local network or beyond
* Accessible by computer, tablets, or phones
* Lyrics
* Playlists
* Favorites and recent tracks
* Multiple artists/albums selection
* Themes

[![Musicalypse_screenshot](https://musicalypse.creasource.net/img/musicalypse-ipad-4.png)](https://musicalypse.creasource.net)

## Build

### Dependencies

To build both the frontend and backend of Musicalypse you will need:

* Java JDK8
* [sbt (scala build tool)](https://www.scala-lang.org/download/)
* [Node & npm](https://nodejs.org/en/download/)

### Run

To run Musicalypse from source use the following commands:

#### For the server

Run `npm run web:run` and connect to [http://localhost:8080](http://localhost:8080).

You can then serve Musicalypse behind a regular Web server (e.g. apache or nginx) and add authentication and SSL (Help wanted to document how to do that).

#### For the desktop

Run `npm run electron:run` and Musicalypse will launch inside electron.

### Develop

#### Frontend development

Run `npm run web:serve` and connect to [http://localhost:4200](http://localhost:4200).

You get hot reloading of the application on file modification.

If you work on electron-specific frontend features then run `npm run electron:serve`.