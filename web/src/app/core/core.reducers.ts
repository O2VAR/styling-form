
import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromCore from './reducers/core.reducers';
import * as fromAudio from './reducers/audio.reducers';

/**
 * State
 */
export interface State {
  core: fromCore.State;
  audio: fromAudio.State;
}

export const reducers: ActionReducerMap<State> = {