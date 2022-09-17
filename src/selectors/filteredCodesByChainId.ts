import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredCodesByChainId = selectorFamily({
  key: "filteredCodesByChainId",
  get: (chainId: string) => ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation?.chains?.filter((chain) => chain.chainId === chainId).map((chain) => {
      return {
        codes: chain.codes
      };
    })[0];
  }
});

export default filteredCodesByChainId;
