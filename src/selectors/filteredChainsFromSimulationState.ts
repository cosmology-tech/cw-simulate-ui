import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { selectAtom } from "jotai/utils";

const filteredChainsFromSimulationState =
  selectAtom(
    cwSimulateEnvState,
    ({env}) => {
      if (!env) {
        return [];
      }
      return env.chains
    },
    () => false,
  );
export default filteredChainsFromSimulationState;
