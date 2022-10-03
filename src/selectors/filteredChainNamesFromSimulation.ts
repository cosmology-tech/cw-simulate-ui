import { atom } from "jotai";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

const filteredChainNamesFromSimulationState =
  atom((get) => {
    const {env} = get(cwSimulateEnvState);
    if (!env) {
      return [];
    }
    return Object.keys(env.chains).sort()
  });
export default filteredChainNamesFromSimulationState;
