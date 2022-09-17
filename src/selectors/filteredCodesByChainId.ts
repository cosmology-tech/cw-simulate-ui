import { selector } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredCodesByChainId = selector({
  key: "filteredCodesByChainId",
  get: ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation?.chains?.map((chain) => {
      return {
        chainId: chain.chainId,
        codes: chain.codes
      }
    });
  }
});

export default filteredCodesByChainId;
