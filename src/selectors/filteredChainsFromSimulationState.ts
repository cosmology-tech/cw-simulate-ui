import { selector } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredChainsFromSimulationState = selector({
  key: "filteredChainsFromSimulationState",
  get: ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation.chains;
  }
});

export default filteredChainsFromSimulationState;
