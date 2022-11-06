import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromLibraryFolders from './reducers/libray.reducers';
import * as fromLyrics from './reducers/lyrics.reducers';
import * as fromRoot from '@app/app.reducers';

export interface SettingsState {
  library: fromLibraryFolders.State;
  lyrics: fromLyr