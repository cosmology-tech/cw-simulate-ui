import { selectorFamily } from "recoil";
import simulationState from "../atoms/simulationState";

const filteredWasmB64ByContractId = selectorFamily({
  key: "filteredWasmB64ByContractId",
  get: (chainIdAndcodeId: {}) => ({get}) => {
    const simulation = get(simulationState);
    // @ts-ignore
    return simulation.simulation?.chains?.filter((chain) => chain.chainId === chainIdAndcodeId.chainId).map((chain) => {
      // @ts-ignore
      chain.codes.filter((code) => code.id === chainIdAndcodeId.codeId).map((code) => {
        return {
          wasmB64: code.wasmBinaryB64
        };
      })
    })[0];
  }
});

export default filteredWasmB64ByContractId;
