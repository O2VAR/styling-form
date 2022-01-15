import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Album} from '@app/model';
import {AlbumsActionsUnion, AlbumsActionTypes} from '@app/library/actions/albums.actions';
import {TracksActionsUnion, TracksActionTypes} from '@app/library/actions/tracks.actions';
import {LibraryUtils} from '@app/library/library.utils';

export const getAlbumId = (album: Album) => album.artist + '-' + album.title;

/**
 * State
 */
export interface State extends EntityState<Album> {
  selectedIds: (string | number)[];
}

export const adapter: EntityAdapter<Album> = createEntityAdapter<Album>({
  selectId: getAlbumId,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const initialState: State = adapter.getInitialState({
  selectedIds: []
});

/**
 * Reducer
 */
export function reducer(
  state = initialState,
  action: AlbumsActionsUnion | TracksActionsUnion
): State {
  switch (action.type) {

    case AlbumsActionTypes.LoadAlbums:
      return adapter.upsertMany(action.payload, state);

    case AlbumsActionTypes.DeselectAllAlbums: {
      return {
        ...state,
        selectedIds: []
      };
    }

    case AlbumsActionTypes.DeselectAlbum: {
      return {
        ...state,
        selectedIds: state.selectedIds.filter(id => id !== getAlbumId(action.payload))
      };
    }

    case AlbumsActionTypes.SelectAlbum: {
      if (state.selectedIds.indexOf(getAlbumId(action.pa