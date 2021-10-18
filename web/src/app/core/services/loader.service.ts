import {Injectable} from '@angular/core';
import {concat, EMPTY, Observable, Subject, throwError} from 'rxjs';
import {catchError, delay, mergeMap, publishReplay, refCount, retryWhen, share, switchMap, take} from 'rxjs/operators';
import {HttpSocketClientService, SocketMessage} from '@app/core/services/http-socket-client.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class LoaderService {

  private readonly loadings$: Observable<number>;
  private loading = new Subject<number>();

  hasErrors$: Observable<boolean>;
  private hasErrors = new Subject<boolean>();

  log$: Observable<string>;
  private log = new Subject<string>();

  initializing$: Observable<boolean>;
  private initializing = new Subject<boolean>();

  private socketObs$: Observable<SocketMessage>;

  constructor(
    private httpSocketClient: HttpSocketClientService,
    private snack: MatSnackBar
  ) {
    this.loadings$ = this.loading.asObservable().pipe(publishReplay(1), refCount());
    this.initializing$ = this.initializing.asObservable().pipe(publishReplay(1), refCount());
    // this.initializing$ = this.httpSocketClient.socketOpened$.pipe(map(opened => !opened), publishReplay(1), refCount())
    this.log$ = this