import { atom } from "jotai";
import {ExecuteTraceLog, ReplyTraceLog} from "@terran-one/cw-simulate/dist/types";

export const stepTraceState = atom<ExecuteTraceLog|ReplyTraceLog|{}>({});
