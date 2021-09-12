import {Action} from '@ngrx/store';

export enum AudioActionTypes {
  SetAudioSource   = 'core/audio/source',
  SetAudioVolume   = 'core/audio/volume',
  SetAudioMuted    = 'core/audio/muted