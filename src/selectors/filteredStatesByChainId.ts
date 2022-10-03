import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

interface States {
  [contract: string]: {
    [key: string]: string;
  };
}

const filteredStatesByChainId = atomFamily((chainId: string) => {
  return atom(get => {
    const {env} = get(cwSimulateEnvState);
    if (!(chainId in env.chains)) return {};
    const states: States = {};

    const decoder = new TextDecoder();
    const chain = env.chains[chainId];
    for (const address in chain.contracts) {
      const contract = chain.contracts[address];
      states[address] = {};
      const currStates = states[address];

      for (const bkey of contract.storage.keys()) {
        const key = decoder.decode(bkey);
        const value = decoder.decode(contract.storage.get(bkey) ?? new Uint8Array(0));
        try {
          const json = JSON.parse(value);
          // TODO: recursive
          for (const prop in json) {
            const subkey = prop.match(/['".\s-]/) ? `${key}["${prop}"]` : `${key}.${prop}`;
            currStates[subkey] = json[prop] + '';
          }
        } catch {
          currStates[key] = value;
        }
      }
    }
    return states;
  });
});

export default filteredStatesByChainId;
