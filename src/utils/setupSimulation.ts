import { CWChain, CWContractInstance, CWSimulateEnv } from "@terran-one/cw-simulate";

export interface ChainConfig {
  chainId: string;
  bech32Prefix: string;
}

/**
 * Setup a brand new simulation environment.
 */
export const createSimulateEnv = (): CWSimulateEnv => {
  if (!window.CWEnv) {
    return new CWSimulateEnv();
  }
  return window.CWEnv;
}

/**
 * Create a chain for a given chain config.
 * @param env
 * @param chainConfig
 */
export const creatChain = (env: CWSimulateEnv, chainConfig: ChainConfig): CWChain => {
  return env.createChain(chainConfig);
}

/**
 * Create a contract instance for a given chain.
 * @param chain
 * @param wasmByteCode
 */
export const createContractInstance = async (chain: CWChain, wasmByteCode: Buffer): Promise<CWContractInstance> => {
  const code = chain.storeCode(wasmByteCode);
  return await chain.instantiateContract(code.codeId);
}

export const buildCwChain = (chains: any, env: CWSimulateEnv) => {
}

