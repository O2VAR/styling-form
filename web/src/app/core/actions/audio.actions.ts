import {Action} from '@ngrx/store';

export enum AudioActionTypes {
  SetAudioSource   = 'core/audio/source',
  SetAudioVolume   = 'core/audio/volume',
  SetAudioMuted    = 'core/audio/muted',
  SetAudioLoading  = 'core/audio/loading',
  SetAudioPlaying  = 'core/audio/playing',
  SetAudioDuration = 'core/audio/duration',
  SetAudioError    = 'core/audio/error',
}

export class SetAudioSource implements Action {
  readonly type = AudioActionTypes.SetAudioSource;
  constructor(public payload: string) {}
}

export class SetAudioVolume implements Action {
  readonly type = AudioActionTypes.SetAudioVolume;
  constructor(public payload: number) {}
}

export class SetAudioMuted implements Action {
  readonly type = AudioActionTypes.SetAudioMuted;
  c