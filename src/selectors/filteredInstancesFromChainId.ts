import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { atomFamily } from "jotai/utils";
import { atom } from "jotai";

const filteredInstancesFromChainId = atomFamily((chainId: string) => {
  return atom(get => {
    const {env} = get(cwSimulateEnvState);
    if (!(chainId in env.chains))
      return [];

    const chain = env.chains[chainId];
    return Object.values(chain.contracts);
  });
});

export default filteredInstancesFromChainId;
