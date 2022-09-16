import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredConfigsFromSimulationState = selectorFamily({
  key: "filteredConfigsFromSimulationState",
  get: (chainId: string) => ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation.chains.filter((chain) => chain.chainId === chainId).map((chain) => {
      return {
        chainId: chain.chainId,
        bech32Prefix: chain.bech32Prefix
      };
    })[0];
  }
});

export default filteredConfigsFromSimulationState;

