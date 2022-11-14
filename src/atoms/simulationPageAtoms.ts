import { atom, useAtom } from "jotai";
import {
  ExecuteTraceLog,
  ReplyTraceLog,
  TraceLog,
  Coin,
  ExecuteEnv,
  ContractResponse,
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
export const currentStateNumber = atom<number>(0);
export const executeQueryTabState = atom<string>("execute");
export const jsonErrorState = atom<string>("");
export const responseState = atom<JSON | undefined>(undefined);
export const stepTraceState = atom<ExecuteTraceLog | ReplyTraceLog | {}>({});
export const traceState = atom<TraceLog[]>([]);
export const stepRequestState = atom<IRequest | undefined>(undefined);
export const stepResponseState =
  atom<{ ok: ContractResponse } | { error: any } | undefined>(undefined);
