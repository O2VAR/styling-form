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
      socketUrl += window.location.protocol === 'http:' ? 'ws://' : 'ws