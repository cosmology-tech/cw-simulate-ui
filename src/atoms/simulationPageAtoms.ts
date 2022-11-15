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
export const compareStates = atom<{ state1: string; state2: string }>({
  state1: "",
  state2: "",
});
export const jsonErrorState = atom<string>("");
export const stepTraceState = atom<TraceLog | undefined>(undefined);
