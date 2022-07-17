import {SettingsActionsUnion, SettingsActionTypes} from '../settings.actions';

/**
 * State
 */
export interface State {
  folders: string[];
  error: string;
  loading: boolean;
}

const initialState: State = {
  folders: [],
  error: '',
  loading: false
};

/**
 * Reducer
 */
export function reducer(
  state: State = initialState,
  action: SettingsActionsUnion
): State {
  switch (action.type) {

    case SettingsActionTypes.LoadLibraryFoldersSuccess:
      return {
        ...state,
        folders: action.payload,
        error: '',
        loading: false
      };

    case SettingsActionTypes.LoadLibraryFoldersFailure:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case SettingsActionTypes.AddLibraryFolderSuccess:
      return {
        ...state,
        folders: [...state.folders, action.payload],
        error: '',
        loading: false
      };

    case SettingsActionTypes.AddLibraryFolderFailure:
      return {
       