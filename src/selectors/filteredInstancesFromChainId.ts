import { selectorFamily } from "recoil";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

const filteredInstancesFromChainId = selectorFamily({
  key: "filteredInstancesFromChainId",
  get: (chainId: string) => ({get}) => {
    const simulation = get(cwSimulateEnvState);
    const chain = simulation.chains[chainId];
    return Object.values(chain.contracts);
  }
});

export default filteredInstancesFromChainId;
