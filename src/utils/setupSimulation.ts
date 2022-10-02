import { CWChain, CWContractInstance, MsgInfo } from "@terran-one/cw-simulate";
import { useCallback } from "react";
import type { Code } from "../atoms/simulationMetadataState";
import simulationMetadataState from "../atoms/simulationMetadataState";
import { useAtom, useAtomValue } from "jotai";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

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

export function useDeleteChainForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string) => {
    delete env.chains[chainId];
    setSimulateEnv({env});

    delete simulationMetadata[chainId];
    setSimulationMetadata(simulationMetadata);

  }, [env, simulationMetadata]);
}

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

export function useStoreCode() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, codeName: string, wasmByteCode: Buffer) => {
    const chain: CWChain = env.chains[chainId];
    const codeId = chain.storeCode(wasmByteCode).codeId;
    setSimulateEnv({env});

    simulationMetadata[chainId].codes[codeName] = {
      name: codeName,
      codeId,
    };
    setSimulationMetadata(simulationMetadata);
    return codeId;
  }, [env, simulationMetadata]);
}

/**
 * Create a contract instance for a given chain.
 */
export function useCreateContractInstance() {
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback(async (chainId: string, code: Code, info: MsgInfo, instantiateMsg: any): Promise<CWContractInstance> => {
    const contract = await env.chains[chainId].instantiateContract(code.codeId);
    contract.instantiate(info, instantiateMsg);
    setSimulateEnv({env});
    return contract;
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
    return contract.executionHistory;
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
