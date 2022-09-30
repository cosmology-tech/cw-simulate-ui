import { selectorFamily } from "recoil";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

interface States {
  [contract: string]: {
    [key: string]: string;
  };
}

const filteredStatesByChainId = selectorFamily({
  key: "filteredStatesByChainId",
  get: (chainId: string) => ({get}): States => {
    const simulation = get(cwSimulateEnvState);
    if (!(chainId in simulation.chains)) return {};
    
    const states: States = {};
    
    const decoder = new TextDecoder();
    const chain = simulation.chains[chainId];
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
        }
        catch {
          currStates[key] = value;
        }
      }
    }
    
    return states;
  }
});

export default filteredStatesByChainId;
