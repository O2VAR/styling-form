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

const serve = process.argv.slice(1).some(val => val === '--serve');

const isPackaged: boolean = __dirname.indexOf('app.asar') !== -1;

const rootDirectory: string = path.normalize(
  isPackaged ?
    path.join(__dirname, '../../../../../') :
    path.join(__dirname, '../../../')
);

const cacheFolder = app.getPath('userData') + '/data';

const windowFile = path.join(cacheFolder, 'window.json');

let win: BrowserWindow;
let serverProcess: ChildProcess;
let appSuspensionId: number;

function createWindow() {

  const screenSize: Size = screen.getPrimaryDisplay().workAreaSize;

  const bounds = getSavedWindowBounds(screenSize);

  win = new BrowserWindow({
    frame: false,
    width: Math.min(bounds.width, screenSize.width),
    height: Math.min(bounds.height, screenSize.height),
    x: Math.max(bounds.x, 0),
    y: Math.max(bounds.y, 0),
    minHeight: 450,
    minWidth: 350,
    show: false,
    backgroundColor: '#000',
    icon: path.join(rootDirectory, 'build/electron/assets/icons/64x64.png')
  });

  if (serve) {
    // dirname is target/electron/dist
    require('electron-reload')(__dirname, {electron: require(`${__dirname}/../../../node_modules/electron`)});
    win.loadURL('http://localhost:4200');
