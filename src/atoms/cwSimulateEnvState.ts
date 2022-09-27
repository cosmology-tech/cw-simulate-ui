import { atom } from "recoil";
import { CWSimulateEnv } from "@terran-one/cw-simulate";

export const cwSimulateEnvState = atom<CWSimulateEnv>({
  key: "CWSimulateEnvState",
  default: <CWSimulateEnv>{}
});
