import {Injectable} from '@angular/core';
import {HttpSocketClientService} from '@app/core/services/http-socket-client.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LyricsOptions, Track} from '@app/model';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CoreUtils} from '@app/core/core.utils';
import {Store} from '@ngrx/store';
import * as fromLibra