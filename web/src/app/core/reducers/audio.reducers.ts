
/**
 * State
 */
import {AudioActionsUnion, AudioActionTypes} from '@app/core/actions/audio.actions';

export interface State {
  audioInput: {
    source: string;
    volume: number;
    muted: boolean;
  };
  audioState: {
    loading: boolean;
    playing: boolean;
    duration: number;
    error: string;