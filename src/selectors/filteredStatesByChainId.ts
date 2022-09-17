import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredStatesByChainId = selectorFamily({
  key: "filteredStatesByChainId",
  get: (chainId: string) => ({get}) => {
    const simulation = get(simulationState);
    // return all key-value pairs of state from simulation
    // @ts-ignore
    return simulation.simulation?.chains?.filter((chain) => chain.chainId === chainId).map((chain) => {
      return {
        states: chain.states
      };
    })[0];
  }
});

export default filteredStatesByChainId;
