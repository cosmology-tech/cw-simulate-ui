import { selector } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredConfigsFromSimulationState = selector({
  key: "filteredConfigsFromSimulationState",
  get: ({get}) => {
    const simulation = get(simulationState);
    // return all chainId and bech32Prefix from simulation
    // @ts-ignore
    return simulation.simulation.chains.map((chain) => {
      return {
        chainId: chain.chainId,
        bech32Prefix: chain.bech32Prefix
      };
    });
  }
});

export default filteredConfigsFromSimulationState;
