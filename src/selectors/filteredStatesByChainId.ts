import { selectorFamily } from "recoil";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

const filteredStatesByChainId = selectorFamily({
  key: "filteredStatesByChainId",
  get: (chainId: string) => ({get}) => {
    const simulation = get(cwSimulateEnvState);
    if (!(chainId in simulation.chains)) return {};
    
    // TODO: construct states from contract instances
    return {};
  }
});

export default filteredStatesByChainId;
