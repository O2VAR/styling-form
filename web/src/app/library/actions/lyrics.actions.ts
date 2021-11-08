import {Action} from '@ngrx/store';
import {Track} from '@app/model';

export enum LyricsActionTypes {
  LoadLyrics        = 'library/lyrics/load',
  LoadLyricsSuccess = 'library/lyrics/load/success',
  LoadLyricsFailure = 'library/lyrics/load/failure',
}

export class LoadLyrics implements Action {
  readonly type = LyricsActionTypes.LoadLyrics;