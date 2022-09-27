import { CWChain } from "@terran-one/cw-simulate";
import { selectorFamily } from "recoil";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

/** Selector to grab a specific chain by its ID. Assumes such a chain exists. */
const filteredChainFromSimulationState = selectorFamily({
  key: "filteredChainFromSimulationState",
  get: (chainId: string) => ({get}): CWChain => {
    const simulation = get(cwSimulateEnvState);
    return simulation.chains[chainId];
  }
});

export default filteredChainFromSimulationState;
