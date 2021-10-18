import {Injectable} from '@angular/core';
import {concat, EMPTY, Observable, Subject, throwError} from 'rxjs';
import {catchError, delay, mergeMap, publishReplay, refCount, retryWhen, share, switchMap, take} from 'rxjs/operators';
import {HttpSocketClientService, SocketMessage} from '@app/core/services/http-socket-client.service';
import {MatSnackBar} from '@angular/mater