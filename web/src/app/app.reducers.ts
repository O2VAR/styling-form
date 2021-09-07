import {ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {environment} from '@env/environment';
import {routerReducer, RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/app.serializer';

export interface State {
  router: RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  router: routerReduc