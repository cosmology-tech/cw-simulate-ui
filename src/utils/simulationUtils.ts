import { Coin, CWChain, CWContractInstance, MsgInfo } from "@terran-one/cw-simulate";
import { CWAccount } from "@terran-one/cw-simulate/dist/account";
import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import type { Code, Codes, SimulationMetadata } from "../atoms/simulationMetadataState";
import simulationMetadataState from "../atoms/simulationMetadataState";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { AsJSON } from "./typeUtils";

export type SimulationJSON = AsJSON<{
  simulationMetadata: SimulationMetadata;
  chains: {
    [key: string]: CWChain;
  };
}>

export interface ChainConfig {
  chainId: string;
  bech32Prefix: string;
}

/**
 * Create a chain for a given chain config.
 */
export function useCreateChainForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);
  return useCallback((chainConfig: ChainConfig) => {
    const chain = env.createChain(chainConfig);
    setSimulateEnv({env});
    simulationMetadata[chainConfig.chainId] = {
      accounts: {},
      codes: {},
    };
    setSimulationMetadata(simulationMetadata);

    return chain;
  }, [env, simulationMetadata]);
}

/**
 * Delete a chain given a chain id.
 */
export function useDeleteChainForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string) => {
    delete env.chains[chainId];
    delete simulationMetadata[chainId];
    setSimulateEnv({env});
    setSimulationMetadata(simulationMetadata);
  }, [env, simulationMetadata]);
}

/**
 * Delete a contract given a chain id and contract address.
 */
export function useDeleteCodeForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, codeId: number) => {
    const chain = env.chains[chainId];
    delete chain.codes[codeId];
    Object.values(simulationMetadata[chainId].codes).forEach((code) => {
      if (code.codeId === codeId) {
        delete simulationMetadata[chainId].codes[code.name];
      }
    });
    setSimulateEnv({env});
    setSimulationMetadata(simulationMetadata);
  }, [env, simulationMetadata]);
}

/**
 * Delete an instance given a chain id and an address.
 */
export function useDeleteInstanceForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, address: string) => {
    const chain = env.chains[chainId];
    delete chain.contracts[address];
    delete simulationMetadata[chainId].codes[address];
    setSimulateEnv({env});
    setSimulationMetadata(simulationMetadata);
  }, [env, simulationMetadata]);
}

/**
 * Delete all instances given a chain id.
 */
export function useDeleteAllInstancesForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, codeId?: number) => {
    const chain = env.chains[chainId];

    if (codeId) {
      Object.entries(chain.contracts).forEach(([address, contract]) => {
        if (contract.contractCode.codeId === codeId) {
          delete chain.contracts[address];
        }
      });
    } else {
      chain.contracts = {};
    }
    setSimulateEnv({env});

    simulationMetadata[chainId].codes = {};
    setSimulationMetadata(simulationMetadata);
  }, [env, simulationMetadata]);
}

/**
 * Update a chain given a chain id and a new chain config.
 */
export function useReconfigureChainForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, newConfig: ChainConfig) => {
    env.chains[newConfig.chainId] = env.chains[chainId];
    if (newConfig.chainId !== chainId) {
      delete env.chains[chainId];
    }
    setSimulateEnv({env});

    simulationMetadata[newConfig.chainId] = simulationMetadata[chainId];
    if (newConfig.chainId !== chainId)
      delete simulationMetadata[chainId];
    setSimulationMetadata(simulationMetadata);
  }, [env, simulationMetadata]);
}

/**
 * Store a WASM code in the simulation environment.
 */
export function useStoreCode() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, codeName: string, wasmByteCode: Buffer) => {
    const chain: CWChain = env.chains[chainId];
    const codeId = chain.storeCode(wasmByteCode).codeId;
    simulationMetadata[chainId].codes[codeName] = {
      name: codeName,
      codeId,
    };
    setSimulateEnv({env});
    setSimulationMetadata(simulationMetadata);
    return codeId;
  }, [env, simulationMetadata, setSimulationMetadata, setSimulateEnv]);
}

/**
 * Store an account in the simulation environment.
 */
export function useCreateAccount() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((id: string, chainId: string, address: string, balances: Coin[]) => {
    const chain: CWChain = env.chains[chainId];

    const balanceMap: { [denom: string]: Coin } = {};
    for (const balance of balances) balanceMap[balance.denom] = balance;

    const account = new CWAccount(address, balanceMap);
    chain.accounts[address] = account;
    setSimulateEnv({env});

    simulationMetadata[chainId].accounts[address] = {id, address};
    setSimulationMetadata(simulationMetadata);

    return account;
  }, [env, simulationMetadata]);
}

/**
 * Delete an account on a chain.
 */
export function useDeleteAccount() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, address: string) => {
    const chain = env.chains[chainId];
    delete chain.accounts[address];
    setSimulateEnv({env});

    delete simulationMetadata[chainId].accounts[address];
    setSimulationMetadata(simulationMetadata);
  }, [env, simulationMetadata]);
}

/**
 * Create a contract instance for a given chain.
 */
export function useCreateContractInstance() {
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback(async (chainId: string, code: Code, info: MsgInfo, instantiateMsg: any): Promise<CWContractInstance> => {
    const contract = await env.chains[chainId].instantiateContract(code.codeId);
    const response = contract.instantiate(info, instantiateMsg);
    if (response.error) {
      delete env.chains[chainId].contracts[contract.contractAddress];
      throw new Error(response.error);
    } else {
      setSimulateEnv({env});
      return contract;
    }
  }, [env]);
}

/**
 * Fetch execution History for a particular contract.
 */
export function useExecutionHistory() {
  const {env} = useAtomValue(cwSimulateEnvState);
  return useCallback((chainId: string, contractAddress: string): any => {
    const chain = env.chains[chainId];
    const contract = chain.contracts[contractAddress];
    return contract?.executionHistory;
  }, [env]);
}

/**
 * Perform execute on a given contract instance.
 */

export function useExecute() {
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string, info: MsgInfo, executeMsg: any): any => {
    const response = env.chains[chainId].contracts[contractAddress].execute(info, executeMsg);
    setSimulateEnv({env});
    return response;
  }, [env]);
}

/**
 * Perform query on a given contract instance.
 */

export function useQuery() {
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string, queryMsg: any): any => {
    const response = env.chains[chainId].contracts[contractAddress].query(queryMsg);
    setSimulateEnv({env});
    return response;
  }, [env, setSimulateEnv]);
}

/**
 * Get the first default chain name by pattern `untitled-${i}` which doesn't exist in `chains` yet.
 */
export function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains?.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}

/**
 * Validate a chain name.
 * @param name
 */
export const isValidChainName = (name: string) => !!name.match(/^.+-\d+$/);

/**
 * Convert code id to code name.
 * @param codeId
 * @param codes
 */
export const convertCodeIdToCodeName = (codeId: string, codes: Codes = {}) => {
  const code = Object.values(codes).find((code) => code.codeId.toString() === codeId);
  return code?.name;
}

/**
 * Setup simulation given a simulation JSON.
 */
export const useSetupSimulationJSON = () => {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);
  const createChain = useCreateChainForSimulation();
  const storeCode = useStoreCode();
  const createContractInstance = useCreateContractInstance();
  return useCallback(async (simulation: SimulationJSON) => {
    for (const [chainId, chain] of Object.entries(simulation.chains)) {
      createChain({
        chainId,
        bech32Prefix: chain.bech32Prefix,
      });

      for (const [codeId, code] of Object.entries(chain.codes)) {
        const codeName = convertCodeIdToCodeName(codeId, simulation.simulationMetadata[chainId].codes) || `untitled-${codeId}.wasm`;
        storeCode(chainId, codeName, Buffer.from(code.wasmBytecode.data));
        const newCode: Code = {
          "codeId": parseInt(codeId),
          "name": codeName
        };
        for (const [contractAddress, instance] of Object.entries(chain.contracts)) {
          if (instance.executionHistory) {
            let newInstance: CWContractInstance;
            for (const execution of instance.executionHistory) {
              if ('instantiateMsg' in execution.request && execution.request.instantiateMsg) {
                const info: MsgInfo = {
                  sender: execution.request.info.sender,
                  funds: execution.request.info.funds,
                };

                const instantiateMsg = execution.request.instantiateMsg;
                // Delete the previous instance if it exists.
                delete env.chains[chainId].contracts[contractAddress];
                newInstance = await createContractInstance(chainId, newCode, info, instantiateMsg);
              }

              if ('executeMsg' in execution.request && execution.request.executeMsg) {
                const executeMsg = execution.request.executeMsg;
                const info: MsgInfo = {
                  sender: execution.request.info.sender,
                  funds: execution.request.info.funds,
                };
                newInstance!.execute(info, executeMsg);
              }
            }
          }
        }
      }
    }
    setSimulateEnv({env});
    setSimulationMetadata(simulation.simulationMetadata);
  }, [simulationMetadata, env]);
}
