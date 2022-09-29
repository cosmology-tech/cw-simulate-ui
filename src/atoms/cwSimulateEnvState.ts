import { CWSimulateEnv } from "@terran-one/cw-simulate";
import { atom } from "recoil";

const cwSimulateEnvState = atom({
  key: "CWSimulateEnvState",
  // dummy empty simulation environment
  default: new CWSimulateEnv(),
});

export default cwSimulateEnvState;
