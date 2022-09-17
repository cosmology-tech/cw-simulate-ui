import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredConfigsByChainId = selectorFamily({
  key: "filteredConfigsByChainId",
  get: (chainId: string) => ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation?.chains?.filter((chain) => chain.chainId === chainId).map((chain) => {
      return {
        chainId: chain.chainId,
        bech32Prefix: chain.bech32Prefix
      };
    })[0];
  }
});

export default filteredConfigsByChainId;

