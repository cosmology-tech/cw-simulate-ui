import { atom } from "recoil";

export type Simulation = {
  simulation: {
    chains: Chain[];
  };
}

export type Chain = {
  chainId: string;
  bech32Prefix: string;
  accounts: Account[];
  codes: Code[];
  states: any[];
}

export type Account = {
  id: string;
  address: string;
  balance: number | bigint;
}

export type Code = {
  /** unique ID of the code, e.g. filename */
  id: string;
  /** base64 binary contents of WASM binary */
  wasmBinaryB64: string;
  /** created code instances */
  instances: Instance[];
}

export type Instance = {
  id: string;
  message: unknown;
}

export function cloneSimulation(simulation: Simulation, chainId: string, contractId: any, allInstances: any[]) {
  return {
    ...simulation,
    simulation: {
      ...simulation.simulation,
      chains: simulation.simulation.chains.map((chain: any) => {
        if (chain.chainId === chainId) {
          return {
            ...chain,
            codes: chain.codes.map((code: any) => {
              if (code.id === contractId) {
                return {
                  ...code,
                  instances: allInstances,
                };
              }
              return code;
            }),
          };
        }
        return chain;
      }),
    },
  };
}

export default atom<Simulation>({
  key: 'simulationState',
  default: {simulation: {chains: []}},
});
