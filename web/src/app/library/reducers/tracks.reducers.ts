import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {ImmutableTrack, toImmutable} from '@app/model';
import {TracksActionsUnion, TracksActionTypes} from '@app/library/actions/t