import {SettingsActionsUnion, SettingsActionTypes} from '../settings.actions';
import {LyricsOptions} from '@app/model';

/**
 * State
 */
export interface State extends LyricsOptions {
  useService: boolean;
  services: {
    wikia: boolean;
    lyricsOvh: boolean;
  };
  automaticSave: boolean;
}

const initialState: State = {
