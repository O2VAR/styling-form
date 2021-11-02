import {Action} from '@ngrx/store';
import {Artist} from '@app/model';

export enum ArtistsActionTypes {
  LoadArtists        = 'library/artists/load',
  SelectArtist       = 'library/artists/select-add',
  SelectArtists      = 'library/artists/sele