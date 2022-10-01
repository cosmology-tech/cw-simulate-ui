import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { atomFamily } from "jotai/utils";
import { atom } from "jotai";

const filteredInstancesFromChainId = atomFamily((chainId: string) => {
  return atom(get => {
    const simulation = get(cwSimulateEnvState);
    if (!(chainId in simulation.chains))
      return [];

    const chain = simulation.chains[chainId];
    return Object.values(chain.contracts);
  });
})

export default filteredInstancesFromChainId;
