import {
  CWChain,
  CWContractCode,
  CWContractInstance,
  CWSimulateEnv,
  MsgInfo
} from "@terran-one/cw-simulate";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { BasicKVIterStorage, IBackend, IStorage, Iter, VMInstance } from '@terran-one/cosmwasm-vm-js';
import { useCallback } from "react";
import type { Code } from "../atoms/simulationMetadataState";
import simulationMetadataState from "../atoms/simulationMetadataState";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import Immutable from "immutable";

export interface ChainConfig {
  chainId: string;
  bech32Prefix: string;
}

/**
 * Create a chain for a given chain config.
 */
export function useCreateChainForSimulation() {
  const setSimulateEnv = useSetRecoilState(cwSimulateEnvState);
  const setSimulationMetadata = useSetRecoilState(simulationMetadataState);

  return useCallback((chainConfig: ChainConfig) => {
    let chain: CWChain;

    setSimulateEnv(simulateEnv => {
      const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
      chain = _simulateEnv_.createChain(chainConfig);
      return _simulateEnv_;
    });

    setSimulationMetadata(prev => ({
      ...prev,
      [chainConfig.chainId]: {
        accounts: {},
        codes: {},
      },
    }));

    return chain!;
  }, []);
}

export function useDeleteChainForSimulation() {
  const setSimulateEnv = useSetRecoilState(cwSimulateEnvState);
  const setSimulationMetadata = useSetRecoilState(simulationMetadataState);

  return useCallback((chainId: string) => {
    setSimulateEnv(simulateEnv => {
      const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
      delete _simulateEnv_.chains[chainId];
      return _simulateEnv_;
    });

    setSimulationMetadata(simulationMetadata => {
      const _simulationMetadata_ = {...simulationMetadata};
      delete _simulationMetadata_[chainId];
      return _simulationMetadata_;
    });
  }, []);
}

export function useReconfigureChainForSimulation() {
  const setSimulateEnv = useSetRecoilState(cwSimulateEnvState);
  const setSimulationMetadata = useSetRecoilState(simulationMetadataState);

  return useCallback((chainId: string, newConfig: ChainConfig) => {
    // newChain being defined assumes chainId actually exists
    // whether or not this is true should be validated at callsite
    let newChain: CWChain;

    setSimulateEnv(simulateEnv => {
      const _simulateEnv_ = cloneSimulateEnv(simulateEnv);

      newChain = _simulateEnv_.chains[newConfig.chainId] = cloneChain(_simulateEnv_.chains[chainId]);
      Object.assign(newChain, newConfig);

      if (newConfig.chainId !== chainId)
        delete _simulateEnv_.chains[chainId];

      return _simulateEnv_;
    });

    setSimulationMetadata(simulationMetadata => {
      const _simulationMetadata_ = {...simulationMetadata};
      _simulationMetadata_[newConfig.chainId] = _simulationMetadata_[chainId];

      if (newConfig.chainId !== chainId)
        delete _simulationMetadata_[chainId];

      return _simulationMetadata_;
    });

    return newChain!;
  }, []);
}

export function useStoreCode() {
  const setSimulateEnv = useSetRecoilState(cwSimulateEnvState);
  const setSimulationMetadata = useSetRecoilState(simulationMetadataState);

  return useCallback((chainId: string, codeName: string, wasmByteCode: Buffer) => {
    let codeId: number;

    setSimulateEnv(simulateEnv => {
      const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
      const _chain_ = _simulateEnv_.chains[chainId] = cloneChain(_simulateEnv_.chains[chainId]);
      codeId = _chain_.storeCode(wasmByteCode).codeId;
      return _simulateEnv_;
    });

    setSimulationMetadata(simulationMetadata => ({
      ...simulationMetadata,
      [chainId]: {
        ...simulationMetadata[chainId],
        codes: {
          ...simulationMetadata[chainId].codes,
          [codeName]: {
            name: codeName,
            codeId,
          },
        },
      },
    }));

    return codeId!;
  }, []);
}

/**
 * Create a contract instance for a given chain.
 */
export function useCreateContractInstance() {
  const [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return useCallback(async (chainId: string, code: Code, info: MsgInfo, instantiateMsg: any): Promise<CWContractInstance> => {
    const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
    const _chain_ = cloneChain(_simulateEnv_.chains[chainId]);
    const contract = await _chain_.instantiateContract(code.codeId);
    contract.instantiate(info, instantiateMsg);

    _simulateEnv_.chains[_chain_.chainId] = _chain_;
    setSimulateEnv(_simulateEnv_);

    return contract;
  }, [simulateEnv]);
}

// Fetch execution History for a particular contract.

export function useExecutionHistory() {
  const simulateEnv = useRecoilValue(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string): any => {
    const chain = simulateEnv.chains[chainId];
    const contract = chain.contracts[contractAddress];
    const response = contract.executionHistory;
    return response;
  }, [simulateEnv]);
}

/**
 * Perform execute on a given contract instance.
 */

export function useExecute() {
  const [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string,info: MsgInfo, executeMsg: any):any => {
    const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
    const _chain_ = cloneChain(_simulateEnv_.chains[chainId]);
    const _contract_ = cloneContractInstance(_chain_.contracts[contractAddress], _chain_);
    const response =   _contract_.execute(info,executeMsg);
    _simulateEnv_.chains[_chain_.chainId] = _chain_;
    setSimulateEnv(_simulateEnv_);
    return response;
  }, [simulateEnv]);
}

/**
 * Perform query on a given contract instance.
 */

export function useQuery() {
  const simulateEnv = useRecoilValue(cwSimulateEnvState);

  return useCallback((chainId: string, contractAddress: string, queryMsg: any): any => {
    const chain = simulateEnv.chains[chainId];
    const contract = chain.contracts[contractAddress];
    const response = contract.query(queryMsg);
    return response;
  }, [simulateEnv]);
}

// CWSimulateEnv cloning helpers (deep-ish copy)

function cloneSimulateEnv(simulateEnv: CWSimulateEnv): CWSimulateEnv {
  const _simulateEnv_ = new CWSimulateEnv();

  for (const chainId in simulateEnv.chains) {
    _simulateEnv_.chains[chainId] = cloneChain(simulateEnv.chains[chainId]);
  }

  return _simulateEnv_;
}

function cloneChain(chain: CWChain): CWChain {
  const _chain_ = new CWChain(chain.chainId, chain.bech32Prefix, chain.height, chain.time);

  for (const codeId in chain.codes) {
    _chain_.codes[codeId] = cloneCWContractCode(chain.codes[codeId]);
  }

  for (const contractId in chain.contracts) {
    _chain_.contracts[contractId] = cloneContractInstance(chain.contracts[contractId], _chain_);
  }

  return _chain_;
}

function cloneContractInstance(contractInstance: CWContractInstance, _chain_: CWChain): CWContractInstance {
  const _contractInstance_ = new CWContractInstance(
    _chain_,
    contractInstance.contractAddress,
    cloneCWContractCode(contractInstance.contractCode),
    cloneBasicKVIterStorage(contractInstance.storage)
  );

  _contractInstance_.executionHistory = cloneExecutionHistory(contractInstance.executionHistory);
  _contractInstance_.vm = cloneVMInstance(contractInstance.vm, _contractInstance_.vm.backend);

  return _contractInstance_;
}

function cloneExecutionHistory(executionHistory: any[]) {
  return [...executionHistory];
}

function cloneCWContractCode(code: CWContractCode) {
  return new CWContractCode(code.codeId, code.wasmBytecode);
}

function cloneBasicKVIterStorage(storage: IStorage) {
  if (storage instanceof BasicKVIterStorage) {
      const _iterators_ = new Map<number, Iter>();
      for (const key of storage.iterators.keys()) {
        const iter =  storage.iterators.get(key)!;
        _iterators_.set(key, { data: [...iter.data], position: iter.position });
      }

      let _dict_ = Immutable.Map<string, string>();
      for (const key of storage.dict.keys()) {
        _dict_ = _dict_.set(key, storage.dict.get(key)!);
      }

      const iterStorage = new BasicKVIterStorage(_iterators_);
      iterStorage.dict = _dict_;
      return iterStorage;
  }

  throw new Error(`IStorage implementation ${typeof storage} not supported`);
}

function cloneVMInstance(vm: VMInstance, _backend_: IBackend) {
  const _vm_ = new VMInstance(_backend_);
  _vm_.PREFIX = vm.PREFIX;
  _vm_.bech32 = vm.bech32;
  _vm_.instance = vm.instance; // WebAssembly backend
  return _vm_;
}
