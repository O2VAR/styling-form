import {Action} from '@ngrx/store';
import {Track} from '@app/model';

export enum TracksActionTypes {
  AddTracks         = 'library/tracks/add',
  RemoveTracks      = 'library/tracks/remove',
  LoadTracks        = 'library/tracks/load',
  LoadTracksSuccess = 'library/tracks/load/success',
  LoadTracksFailure = 'library/tracks/load/failure',
  ScanTracks        = 'library/tracks/scan',
}

export class AddTracks implements Action {
  readonly type = TracksActionTypes.AddTracks;
  constructor(public payload: Track[]) {}
}

export class RemoveTracks 