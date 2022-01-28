import {LyricsActionsUnion, LyricsActionTypes} from '../actions/lyrics.actions';

export interface State {
  loading: boolean;
  lyrics: string;
  error: string;
  source: string;
}

export const initialState: State = {
  loading: false,
  lyrics: null,
  error: null,
  s