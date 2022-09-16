import { selector } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredStatesFromSimulationState = selector({
  key: "filteredStatesFromSimulationState",
  get: ({get}) => {
    const simulation = get(simulationState);
    // return all key-value pairs of state from simulation
    // @ts-ignore
    return simulation.simulation.chains.map((chain) => {
      return {
        chainId: chain.chainId,
        states: chain.state
      }
    });
  }
});

export default filteredStatesFromSimulationState;
