import { TraceLog } from "@terran-one/cw-simulate/dist/modules/wasm";
import { atom } from "jotai";

const traceState = atom<TraceLog[]>([]);
export default traceState;
