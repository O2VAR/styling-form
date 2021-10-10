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

  send(message: any): void {
    this.socket.next(message);
  }

  ngOnDestroy(): void {
    this.socket.unsubscribe();
  }

  get(path: string): Observable<Object> {
    if (this.preferHttpOverSocket || !this.socketOpened) {
      return this.httpClient.get(HttpSocketClientService.getAPIUrl(path));
    } else {
      const request: HttpRequest = {
        method: 'HttpRequest',
        entity: {
          method: 'GET',
          url: HttpSocketClientService.getAPIUrl(path)
        },
        id: this.id++
      };
      return this.sendRequest(request);
    }
  }

  post(path: string, entity: Object): Observable<Object> {
    if (this.preferHttpOverSocket || !this.socketOpened) {
      return this.httpClient.post(
        HttpSocketClientService.getAPIUrl(path),
        JSON.stringify(entity),
        { headers: {'Content-Type': 'application/json'}}
      );
    } else {
      const request: HttpRequest = {
        method: 'HttpRequest',
        entity: {
          method: 'POST',
          url: HttpSocketClientService.getAPIUrl(path),
          entity: entity
        },
        id: this.id++
      };
      return this.sendRequest(request);
    }
  }

  postFiles(path: string, files: File[]): Observable<Object> {
    const filesObs: Observable<Object>[] =
      files.map( file => this.postFile(path, file).pipe(map(event => ({event: event, file: file }))));

    // const acknowledgment = Observable.create(observer => {
    //   observer.next({ event: { type: 10 }});
    //   observer.complete();
    //   return () => {};
    // });

    return filesObs.reduce((obs1: Observable<Object>, obs2) => concat(obs1, obs2));

  }

  postFile(path: string, file: File): Observable<Object> {
    const formData = new FormData();
    formData.append('file', file, f