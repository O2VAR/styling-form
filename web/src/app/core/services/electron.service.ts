import {Injectable} from '@angular/core';
import {environment} from '@env/environment';

@Injectable()
export class ElectronService {

  private ipcRenderer: any;
  private remote: any;
  private shell: any;

  constructor() {
    if (environment.electron) {
      const electron = (<any>window).require('electron');
      this.ipcRenderer = electron.ip