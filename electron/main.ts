import {app, BrowserWindow, screen, powerMonitor, powerSaveBlocker} from 'electron';
import * as path from 'path';
import * as url from 'url';
import {ChildProcess} from 'child_process';
import Rectangle = Electron.Rectangle;
import Size = Electron.Size;

const fs = require('fs');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const spawn = require('child_process').spawn;

const serve = proc