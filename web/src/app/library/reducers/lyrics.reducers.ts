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
  source: null
};

export function reducer(
  state = initialState,
  action: LyricsActionsUnion
): State {
  switch (action.type) {

    case LyricsActionTypes.LoadLyrics: {
      return {
        ...state,
        loading: true,
        lyrics: null,
        error: null,
        source: 