
import {List} from 'immutable';

import {ImmutablePlaylist, Playlist, toImmutable} from '@app/model';
import {PlaylistsActionTypes, PlaylistsActionUnion} from '@app/library/actions/playlists.actions';

export interface State {
  playlists: List<ImmutablePlaylist>;
}

export const initialState: State = {
  playlists: List(),
};

export function reducer(
  state = initialState,
  action: PlaylistsActionUnion
): State {
  switch (action.type) {

    case PlaylistsActionTypes.AddToPlaylist: {
      const playlistIndex = state.playlists.findIndex(p => p.get('name') === action.playlistName);
      if (playlistIndex === -1) {
        return {
          ...state,
          playlists: state.playlists.push(toImmutable({name: action.playlistName, tracks: action.tracks}))
        };
      } else {
        const playlist = state.playlists.get(playlistIndex);
        return {
          ...state,
          playlists: state.playlists.set(
            playlistIndex,
            playlist.set('tracks', playlist.get('tracks').union(action.tracks))
          )
        };