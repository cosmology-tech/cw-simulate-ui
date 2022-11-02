import { atom } from "jotai";
import {ExecuteTraceLog, ReplyTraceLog} from "@terran-one/cw-simulate/dist/modules/wasm";

export const stepTraceState = atom<ExecuteTraceLog|ReplyTraceLog|{}>({});
 