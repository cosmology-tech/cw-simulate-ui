import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredAccountsFromSimulationState = selectorFamily({
  key: "filteredAccountsFromSimulationState",
  get: (chainId: string) => ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation.chains.filter((chain) => chain.chainId === chainId).map((chain) => {
      return {
        accounts: chain.accounts
      };
    })[0];
  }
});

export default filteredAccountsFromSimulationState;
