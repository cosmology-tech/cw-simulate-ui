import { CWSimulateEnv } from "@terran-one/cw-simulate";
import { atom } from "recoil";

const cwSimulateEnvState = atom<CWSimulateEnv>({
  key: "CWSimulateEnvState",
  default: <CWSimulateEnv>{}
});

export default cwSimulateEnvState;
