import { selectorFamily } from "recoil";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { ChainConfig } from "../utils/setupSimulation";

const filteredConfigsByChainId = selectorFamily({
  key: "filteredConfigsByChainId",
  get: (chainId: string) => ({get}): ChainConfig => {
    const simulation = get(cwSimulateEnvState);
    if (!(chainId in simulation.chains)) {
      return {
        chainId: 'invalid-1',
        bech32Prefix: 'invalid',
      };
    }
    
    const { bech32Prefix } = simulation.chains[chainId];
    return {
      chainId,
      bech32Prefix,
    };
  }
});

export default filteredConfigsByChainId;

