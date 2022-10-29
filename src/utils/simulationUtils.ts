import { useAtom } from "jotai";
import { useCallback } from "react";
import type { Codes, SimulationMetadata } from "../atoms/simulationMetadataState";
import { AsJSON } from "./typeUtils";
import { CWSimulateApp } from "@terran-one/cw-simulate";
import { Coin } from "@terran-one/cw-simulate/dist/contract";
import cwSimulateAppState from "../atoms/cwSimulateAppState";
import { CWSimulateAppOptions } from "@terran-one/cw-simulate/dist/CWSimulateApp";
import { CWChain } from "@terran-one/cw-simulate/dist/chain";
import traceState from "../atoms/traceState";

export type SimulationJSON = AsJSON<{
  simulationMetadata: SimulationMetadata;
  chains: {
    [key: string]: CWChain;
  };
}>

/**
 * This hook is used to initialize the simulation state.
 */
export function useCreateNewSimulation() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState)
  return useCallback((options: CWSimulateAppOptions) => {
    const app = new CWSimulateApp({
      chainId: options.chainId,
      bech32Prefix: options.bech32Prefix
    });

    setSimulateApp({app});
    return app;
  }, [app]);
}

/**
 * This hook is used to store new WASM bytecode in the simulation state.
 */
export function useCreateCode() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState)
  return useCallback((creator: string, wasm: Uint8Array) => {
    const codeId = app.wasm.create(creator, wasm);
    setSimulateApp({app});
    return codeId;
  }, [app]);
}

/**
 * This hook is used to instantiate a contract in the simulation state.
 */
export function useInstantiateContract() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  return useCallback(async (sender: string, funds: Coin[], codeId: number, instantiateMsg: any) => {
    const result = await app.wasm.instantiateContract(sender, funds, codeId, instantiateMsg);
    setSimulateApp({app});
    return result;
  }, [app]);
}

/**
 * This hook is used to execute a contract in the simulation state.
 */
export function useExecuteContract() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const [trace, setTrace] = useAtom(traceState);
  return useCallback(async (sender: string, funds: Coin[], contractAddress: string, executeMsg: any) => {
    const result = await app.wasm.executeContract(sender, funds, contractAddress, executeMsg, trace);
    setSimulateApp({app});
    setTrace(trace);
    return result;
  }, [app]);
}

/**
 * This hook is used to query a contract in the simulation state.
 */
export function useQueryContract() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  return useCallback(async (contractAddress: string, queryMsg: any) => {
    const result = await app.wasm.query(contractAddress, queryMsg);
    setSimulateApp({app});
    return result;
  }, [app]);
}

/**
 * This hook is used to execute sub message in the simulation state.
 */
export function useExecuteSubMsg() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const [trace, setTrace] = useAtom(traceState);
  return useCallback(async (contractAddress: string, message: any) => {
    const result = await app.wasm.executeSubmsg(contractAddress, message, trace);
    setSimulateApp({app});
    setTrace(trace);
    return result;
  }, [app]);
}

/**
 * This hook is used to call reply in the simulation state.
 */
export function useReply() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState)
  return useCallback(async (contractAddress: string, replyMessage: any, trace: any) => {
    const result = await app.wasm.reply(contractAddress, replyMessage, trace);
    setSimulateApp({app});
    return result;
  }, [app]);
}

export interface ChainConfig {
  chainId: string;
  bech32Prefix: string;
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
