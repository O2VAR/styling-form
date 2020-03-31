const convertToWindowsStore = require('electron-windows-store');
const prompt = require('prompt-sync')();

const windowsKit = prompt('Path to Windows Kit: ');

const fs = require('fs-extra');

const options = {
  containerVirtualization: false,
  inputDirectory: __dirname + '/../dist/electron/win-ia32-unpacked',
  outputDirectory: __dirname + '/../dist',
  packageVer