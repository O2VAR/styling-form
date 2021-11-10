import {Action} from '@ngrx/store';
import {Track} from '@app/model';

export enum TracksActionTypes {
  AddTracks         = 'library/tracks/add',
  RemoveTracks      = 'library/tracks/remove',
  LoadTracks        = 'library/tracks/load',
  LoadTracksSuccess = '