import {Set} from 'immutable';
import {ImmutableTrack, toImmutable, Track} from '@app/model';
import {FavoritesActionsUnion, FavoritesActionTypes} from '../actions/favorites.actions';

export interface State {
  favorites: Set<Immut