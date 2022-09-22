import { CWChain, CWContractCode, CWContractInstance, CWSimulateEnv, MsgInfo } from "@terran-one/cw-simulate";
import { useRecoilState, useRecoilValue } from "recoil";
import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist({ key: "cwSimulateEnvState" });
const cwSimulateEnvState = atom<CWSimulateEnv>({
  key: "CWSimulateEnvState",
  default: <CWSimulateEnv>{},
  effects_UNSTABLE: [persistAtom]
});

export interface ChainConfig {
  chainId: string;
  bech32Prefix: string;
}

/**
 * Create a chain for a given chain config.
 * @param env
 * @param chainConfig
 */
export function useCreateChainForSimulation() {
  let [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return (chainConfig: ChainConfig): CWChain => {
    if (!simulateEnv.chains) {
      simulateEnv = new CWSimulateEnv();
    }

    const env = cloneSimulateEnv(simulateEnv);
    const chain = env.createChain(chainConfig);
    setSimulateEnv(env);

    return chain;
  }
};

/**
 * Create a contract instance for a given chain.
 * @param chain
 * @param wasmByteCode
 */
export function useCreateContractInstance() {
  let [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return async function (chain: CWChain, wasmByteCode: Buffer): Promise<CWContractInstance> {
    const newSimulateEnv = cloneSimulateEnv(simulateEnv);
    const newChain = cloneChain(chain);

    const code = newChain.storeCode(wasmByteCode);
    const contract = await newChain.instantiateContract(code.codeId);

    newSimulateEnv.chains[newChain.chainId] = cloneChain(newChain);
    setSimulateEnv(newSimulateEnv);

    return contract;
  }
}

export function useChains() {
  let simulateEnv = useRecoilValue(cwSimulateEnvState);
  return simulateEnv.chains;
}

export function useInstantiate() {
  let [simulateEnv, setSimulateEnv] = useRecoilState(cwSimulateEnvState);

  return function(chainId: string, contract: CWContractInstance, info: MsgInfo, message: any) {
    const newContract = cloneContractInstance(simulateEnv.chains[chainId], contract);
    newContract.instantiate(info, message);

    const newSimulateEnv = cloneSimulateEnv(simulateEnv);
    newSimulateEnv.chains[chainId].contracts[newContract.contractAddress] = newContract;

    setSimulateEnv(newSimulateEnv);
  }
}

function cloneSimulateEnv(simulateEnv: CWSimulateEnv): CWSimulateEnv {
  const newEnv = new CWSimulateEnv();

  for (const chainId in simulateEnv.chains) {
    const chain = simulateEnv.chains[chainId];
    newEnv.chains[chainId] = cloneChain(chain);
  }

  return newEnv;
}

function cloneChain(chain: CWChain): CWChain {
  const newChain = new CWChain(chain.chainId, chain.bech32Prefix, chain.height, chain.time);

  for (const codeId in chain.codes) {
    const code = chain.codes[codeId];
    newChain.codes[codeId] = new CWContractCode(code.codeId, code.wasmBytecode);
  }

  for (const contractId in chain.contracts) {
    const code = chain.contracts[contractId];
    newChain.contracts[contractId] = cloneContractInstance(chain, code);
  }

  return newChain;
}

function cloneContractInstance(chain: CWChain, contractInstance: CWContractInstance): CWContractInstance {
  const instance = new CWContractInstance(
    chain,
    contractInstance.contractAddress,
    contractInstance.contractCode,
    contractInstance.storage
  );
  instance.vm = contractInstance.vm;
  instance.executionHistory = contractInstance.executionHistory;
  instance.instantiate = contractInstance.instantiate;

  return instance;
}
