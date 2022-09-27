import { selector } from "recoil";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

const filteredChainsFromSimulationState = selector({
  key: "filteredChainsFromSimulationState",
  get: ({get}) => {
    const simulation = get(cwSimulateEnvState);
    return simulation.chains ?? {};
  }
});

export default filteredChainsFromSimulationState;
