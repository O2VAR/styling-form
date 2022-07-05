import {SettingsActionsUnion, SettingsActionTypes} from '../settings.actions';

/**
 * State
 */
export interface State {
  folders: string[];
  error: string;
  loading: boolean;
}

con