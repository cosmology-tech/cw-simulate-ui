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
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);
  return useCallback((chainConfig: ChainConfig) => {
    simulateEnv.createChain(chainConfig);
    setSimulateEnv(simulateEnv);
    simulationMetadata[chainConfig.chainId] = {
      accounts: {},
      codes: {},
    };
    setSimulationMetadata(simulationMetadata);

    return simulateEnv.chains;
  }, []);
}

export function useDeleteChainForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string) => {
    delete simulateEnv.chains[chainId];
    setSimulateEnv(simulateEnv);

    delete simulationMetadata[chainId];
    setSimulationMetadata(simulationMetadata);

  }, [simulateEnv, simulationMetadata]);
}

export function useReconfigureChainForSimulation() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, newConfig: ChainConfig) => {
    simulateEnv.chains[newConfig.chainId] = simulateEnv.chains[chainId];
    if (newConfig.chainId !== chainId) {
      delete simulateEnv.chains[chainId];
    }
    setSimulateEnv(simulateEnv);

    simulationMetadata[newConfig.chainId] = simulationMetadata[chainId];
    if (newConfig.chainId !== chainId)
      delete simulationMetadata[chainId];
    setSimulationMetadata(simulationMetadata);

    return simulateEnv.chains[chainId];
  }, [simulateEnv, simulationMetadata]);
}

export function useStoreCode() {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, codeName: string, wasmByteCode: Buffer) => {
    const chain: CWChain = simulateEnv.chains[chainId];
    const codeId = chain.storeCode(wasmByteCode).codeId;
    setSimulateEnv(simulateEnv);

    simulationMetadata[chainId].codes[codeName] = {
      name: codeName,
      codeId,
    };
    setSimulationMetadata(simulationMetadata);
    return codeId;
  }, [simulateEnv, simulationMetadata]);
}

/**
 * Create a contract instance for a given chain.
 */
export function useCreateContractInstance() {
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback(async (chainId: string, code: Code, info: MsgInfo, instantiateMsg: any): Promise<CWContractInstance> => {
    const contract = await simulateEnv.chains[chainId].instantiateContract(code.codeId);
    contract.instantiate(info, instantiateMsg);
    setSimulateEnv(simulateEnv);
    return contract;
  }, [simulateEnv]);
}

// Fetch execution History for a particular contract.

export function useExecutionHistory() {
  const simulateEnv = useAtomValue(cwSimulateEnvState);
  return useCallback((chainId: string, contractAddress: string): any => {
    const chain = simulateEnv.chains[chainId];
    const contract = chain.contracts[contractAddress];
    return contract.executionHistory;
  }, [simulateEnv]);
}

/**
 * Perform execute on a given contract instance.
 */

export function useExecute() {
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string, info: MsgInfo, executeMsg: any): any => {
    const response = simulateEnv.chains[chainId].contracts[contractAddress].execute(info, executeMsg);
    setSimulateEnv(simulateEnv);
    return response;
  }, [simulateEnv]);
}

/**
 * Perform query on a given contract instance.
 */

export function useQuery() {
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string, queryMsg: any): any => {
    const response = simulateEnv.chains[chainId].contracts[contractAddress].query(queryMsg);
    setSimulateEnv(simulateEnv);
    return response;
  }, [simulateEnv]);
}
