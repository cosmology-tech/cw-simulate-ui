import { atom } from "jotai";
import {
  Coin,
  ExecuteEnv,
  TraceLog,
} from "@terran-one/cw-simulate/dist/types";

export interface IRequest {
  env: ExecuteEnv;
  info:
    | {
        sender: string;
        funds: Coin[];
      }
    | {};
  executeMsg: any;
}

export const blockState = atom<JSON | undefined>(undefined);
export const compareStates = atom<{ state1: object | undefined; state2: object | undefined }>({
  state1: undefined,
  state2: undefined,
});
export const stepTraceState = atom<TraceLog | undefined>(undefined);
export const activeStepState = atom<string>('');

// ----- DERIVED ATOMS -----
export const compareStringsState = atom(get => {
  const { state1, state2 } = get(compareStates);
  return [state1, state2];
});
export const isDiffOpenState = atom(get => {
  const { state1, state2 } = get(compareStates);
  return !!(state1 || state2);
});
