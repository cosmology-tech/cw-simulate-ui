import { CWSimulateEnv } from "@terran-one/cw-simulate";
import { atom } from "jotai";

const cwSimulateEnvState = atom(new CWSimulateEnv());

export default cwSimulateEnvState;
