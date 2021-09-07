import {ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {environment} from '@env/environment';
import {routerReducer, RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/app.serializer';

export interface State {
  router: RouterReducerS