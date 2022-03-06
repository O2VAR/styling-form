import {fromJS, Map, Set} from 'immutable';

// https://stackoverflow.com/questions/43607652/typescript-immutable-proper-way-of-extending-immutable-map-type

interface ImmutableMap<T> extends Map<string, any> {}

export function toImmutable<T extends object