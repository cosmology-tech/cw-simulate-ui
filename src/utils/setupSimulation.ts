import { CWChain, CWContractCode, CWContractInstance, CWSimulateEnv, MsgInfo } from "@terran-one/cw-simulate";
import { useRecoilState, useRecoilValue } from "recoil";
import { atom } from "recoil";
import { BasicKVIterStorage, IStorage, IBackend, VMInstance } from '@terran-one/cosmwasm-vm-js';
import { useCallback } from "react";

const cwSimulateEnvState = atom<CWSimulateEnv>({
  key: "CWSimulateEnvState",
  default: <CWSimulateEnv>{}
});

export interface ChainConfig {
  chainId: string;
  bech32Prefix: string;
}

/**
 * Create a chain for a given chain config.
 */
export function useCreateChainForSimulation() {
  let [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return useCallback((chainConfig: ChainConfig): CWChain => {
    if (!simulateEnv.chains) {
      simulateEnv = new CWSimulateEnv();
    }

    const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
    const chain = _simulateEnv_.createChain(chainConfig);
    setSimulateEnv(_simulateEnv_);

    return chain;
  }, [simulateEnv, setSimulateEnv]);
};

/**
 * Create a contract instance for a given chain.
 */
export function useCreateContractInstance() {
  let [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return useCallback(async (chain: CWChain, wasmByteCode: Buffer): Promise<CWContractInstance> => {
    const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
    const _chain_ = cloneChain(chain);

    const code = _chain_.storeCode(wasmByteCode);
    const contract = await _chain_.instantiateContract(code.codeId);

    _simulateEnv_.chains[_chain_.chainId] = cloneChain(_chain_);
    setSimulateEnv(_simulateEnv_);

    return contract;
  }, [simulateEnv, setSimulateEnv]);
}

/**
 * Gets the chains defined in the current environment.
 */
export function useChains() {
  let simulateEnv = useRecoilValue(cwSimulateEnvState);
  return simulateEnv.chains;
}

/**
 * Instantiates a contract.
 */
export function useInstantiate() {
  let [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return useCallback((chainId: string, contract: CWContractInstance, info: MsgInfo, message: any) => {
    const _contract_ = cloneContractInstance(contract, simulateEnv.chains[chainId]);
    _contract_.instantiate(info, message);

    const _simulateEnv_ = cloneSimulateEnv(simulateEnv);
    _simulateEnv_.chains[chainId].contracts[_contract_.contractAddress] = _contract_;

    setSimulateEnv(_simulateEnv_);
  }, [simulateEnv, setSimulateEnv]);
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
  if (storage instanceof BasicKVIterStorage)
    return new BasicKVIterStorage(storage.iterators);

  throw new Error(`IStorage implementation ${typeof storage} not supported`)
}

function cloneVMInstance(vm: VMInstance, _backend_: IBackend) {
  const _vm_ = new VMInstance(_backend_);
  _vm_.PREFIX = vm.PREFIX;
  _vm_.bech32 = vm.bech32;
  _vm_.instance = vm.instance; // WebAssembly backend
  return _vm_;
}
