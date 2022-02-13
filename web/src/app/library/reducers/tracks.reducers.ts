import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {ImmutableTrack, toImmutable} from '@app/model';
import {TracksActionsUnion, TracksActionTypes} from '@app/library/actions/tracks.actions';

/**
 * State
 */
export interface State extends EntityState<ImmutableTrack> {
  error: string;
  loading: boolean;
}

export const adapter: EntityAdapter<ImmutableTrack> = createEntityAdapter<ImmutableTrack>({
  selectId: (track: Immu