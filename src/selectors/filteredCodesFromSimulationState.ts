import { selector } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredCodesFromSimulationState = selector({
  key: "filteredCodesFromSimulationState",
  get: ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation.chains.map((chain) => {
      return {
        chainId: chain.chainId,
        codes: chain.codes
      }
    });
  }
});

export default filteredCodesFromSimulationState;
