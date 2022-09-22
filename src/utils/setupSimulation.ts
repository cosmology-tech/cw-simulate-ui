import { CWChain, CWContractInstance, CWSimulateEnv } from "@terran-one/cw-simulate";
import { useRecoilState, useRecoilValue } from "recoil";
import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist({ key: "cwSimulateEnvState" });
const cwSimulateEnvState = atom<CWSimulateEnv>({
  key: "CWSimulateEnvState",
  default: <CWSimulateEnv>{},
  effects_UNSTABLE: [persistAtom],
  dangerouslyAllowMutability: true
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

    const chain = simulateEnv.createChain(chainConfig);

    setSimulateEnv(simulateEnv);

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
    const code = chain.storeCode(wasmByteCode);
    const contract = await chain.instantiateContract(code.codeId);

    simulateEnv.chains[chain.chainId] = chain;
    setSimulateEnv(simulateEnv);

    return contract;
  }
}

export function useChains() {
  let simulateEnv = useRecoilValue(cwSimulateEnvState);
  return simulateEnv.chains;
}
