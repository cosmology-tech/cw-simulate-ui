import { selector } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredAccountsFromSimulationState = selector({
  key: "filteredAccountsFromSimulationState",
  get: ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation.chains.map((chain) => {
      return {
        chainId: chain.chainId,
        accounts: chain.accounts
      }
    });
  }
});

export default filteredAccountsFromSimulationState;
