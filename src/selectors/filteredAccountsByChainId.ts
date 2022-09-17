import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredAccountsByChainId = selectorFamily({
  key: "filteredAccountsByChainId",
  get: (chainId: string) => ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation?.chains?.filter((chain) => chain.chainId === chainId).map((chain) => {
      return {
        accounts: chain.accounts
      };
    })[0];
  }
});

export default filteredAccountsByChainId;
