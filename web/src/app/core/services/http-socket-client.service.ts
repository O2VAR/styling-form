import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {webSocket} from 'rxjs/webSocket';
import {concat, Observable, Subject} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

import {environment} from '@env/environment';

@Injectable()
export class HttpSocketClientService implements OnDestroy {

  constructor(private httpClient: HttpClient) { }

  public id = 1;

  private socketOpened = false;

  private preferHttpOverSocket = false;

  private socket: Subject<Object> = webSocket({
    url: HttpSocketClientService.getSocketUrl(),
    openObserver: {
      next: () => this.socketOpened = true
    },
    closeObserver: {
      next: () => this.socketOpened = false
    }
  });

  private socketObs: Observable<SocketMessage> = this.socket.asObservable().pipe(share()) as Observable<SocketMessage>;

  private static getSocketUrl() {
    let socketUrl = '';
    if (environment.electron) {
      socketUrl += 'ws://localhost:' + environment.httpPort;
    } else {
      socketUrl += window.location.protocol === 'http:' ? 'ws://' : 'wss://';
      socketUrl += window.location.hostname;
      if (environment.production) {
        if (window.location.port) {
          socketUrl += ':' + window.location.port;
        }
      } else {
        socketUrl += ':' + environment.httpPort;
      }
    }
    socketUrl += '/socket';
    return socketUrl;
  }

  private static getAPIUrl(path: string) {
    let url = '';
    if (environment.electron) {
      url += 'http://localhost:' + environment.httpPort;
    } else {
      url += window.location.protocol + '//' + window.location.hostname;
      if (environment.production) {
        if (window.location.port) {
          url += ':' + window.location.port;
        }
      } else {
        url += ':' + environment.httpPort;
      }
    }
    url += path;
    return url;
  }

  getSocket(): Observable<SocketMessage> {
    return this.socketObs;
  }

  send(message: