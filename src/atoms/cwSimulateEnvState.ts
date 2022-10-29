import { CWSimulateEnv } from "@terran-one/cw-simulate";
import {CWSimulateApp} from "@terran-one/cw-simulate";
import { atom } from "jotai";

const cwSimulateEnvState = atom({env: new CWSimulateEnv()});

export default cwSimulateEnvState;
