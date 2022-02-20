import {Injectable} from '@angular/core';
import {HttpSocketClientService} from '@app/core/services/http-socket-client.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LyricsOptions, Track} from '@app/model';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CoreUtils} from '@app/core/core.utils';
import {Store} from '@ngrx/store';
import * as fromLibrary from '@app/library/library.reducers';

@Injectable()
export class LyricsService {


  constructor(
    private httpSocketClient: HttpSocketClientService,
    private httpClient: HttpClient,
    private store: Store<fromLibrary.State>
  ) {}

  requestLyrics(track: Track, opts: LyricsOptions): Observable<[string, string]> {
    return this.geLyricsFromApi(track).pipe(
      map(lyrics => [lyrics, 'local'] as [string, string]),
      catchError(error => {
        if (opts.useService && opts.services.wikia) {
          return this.getLyricsFromWikia(track).pipe(
            map(lyrics => [lyrics, 'lyrics.wikia.com'] as [string, string])
          );
        } else {
          throw error;
        }
      }),
      catchError(error => {
        if (opts.useService && opts.services.lyricsOvh) {
          return this.getLyricsFromLyricsOvh(track).pipe(
            map(lyrics => [lyrics, 'lyrics.ovh'] as [string, string])
          );
        } else {
          throw error;
        }
      }),
    );
  }

  geLyricsFromApi(track: Track): Observable<string> {
    return this.httpSocketClient.get('/api/lyrics/' + encodeURI(track.artist) + '/' + encodeURI(track.title)).pipe(
      map((response: { lyrics: string }) => response.lyrics),
      catchError((error: HttpErrorResponse) => { throw new Error(error.message); })
    );
  }

  getLyricsFromWikia(track: Track): Observable<string> {
    const url = 'http://lyrics.wikia.com/wiki/' +
      encodeURICo