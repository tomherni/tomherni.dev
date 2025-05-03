import type { GlobalState } from '@types';

let state: GlobalState;

export function setState(_state: GlobalState): void {
  state = _state;
}

export function getState(): GlobalState {
  if (!state) {
    throw new Error('Global state is not set');
  }
  return state;
}
