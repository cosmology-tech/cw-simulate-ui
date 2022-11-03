import { TraceLog } from "@terran-one/cw-simulate/dist/types";
import { atom } from "jotai";

const traceState = atom<TraceLog[]>([]);
export default traceState;
