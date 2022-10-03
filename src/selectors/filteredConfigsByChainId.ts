import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { atomFamily } from "jotai/utils";
import { atom } from "jotai";

const filteredConfigsByChainId = atomFamily((chainId: string) => {
  return atom(get => {
    const {env} = get(cwSimulateEnvState);
    if (!(chainId in env.chains)) {
      return {
        chainId: 'invalid-1',
        bech32Prefix: 'invalid',
      };
    }

    const {bech32Prefix} = env.chains[chainId];
    return {
      chainId,
      bech32Prefix,
    };
  });
});

export default filteredConfigsByChainId;

