const convertToWindowsStore = require('electron-windows-store');
const prompt = require('prompt-sync')();

const windowsKit = prompt('Path to Windows Kit: ');

const fs = require('fs-extra');

const options = {
  containerVirtualization: false,
  inputDirectory: __dirname + '/../dist/electron/win-unpacked',
  outputDirectory: __dirname + '/../dist',
  packageVersion: '1.0.0.0',
  packageName: '53695CreaSource.Musicalypse',
  packageDisplayName: 'Musicalypse',
  packageDescription: 'A modern audio player built with Web technologies.',
  packageExecutable: 'app/Musicalypse.exe',
  assets: __dirname + '/../build/UWP/assets',
  manifest: __dirname + '/../bu