import { useAtom } from "jotai";
import { useCallback } from "react";
import type { Codes, SimulationMetadata } from "../atoms/simulationMetadataState";
import simulationMetadataState from "../atoms/simulationMetadataState";
import { AsJSON } from "./typeUtils";
import { CWSimulateApp } from "@terran-one/cw-simulate";
import { Coin } from "@terran-one/cw-simulate/dist/types";
import cwSimulateAppState from "../atoms/cwSimulateAppState";
import { CWSimulateAppOptions } from "@terran-one/cw-simulate/dist/CWSimulateApp";
import traceState from "../atoms/traceState";
import { DEFAULT_FUNDS, SENDER_ADDRESS } from "../configs/variables";

export type SimulationJSON = AsJSON<{
  simulationMetadata: SimulationMetadata;
}>

/**
 * This hook is used to initialize the simulation state.
 */
export function useCreateNewSimulateApp() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState)
  return useCallback((options: CWSimulateAppOptions) => {
    const app = new CWSimulateApp({
      chainId: options.chainId,
      bech32Prefix: options.bech32Prefix
    });
    setSimulateApp({app});
    return app;
  }, [app, setSimulateApp]);
}

/**
 * This hook is used to store new WASM bytecode in the simulation state.
 */
export function useStoreCode() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const [{metadata}, setSimulationMetadata] = useAtom(simulationMetadataState);
  return useCallback((creator: string, file: { filename: string, fileContent: Buffer | JSON }) => {
    const codeId = app.wasm.create(creator, file.fileContent as Buffer);
    app.bank.setBalance(SENDER_ADDRESS, DEFAULT_FUNDS);
    setSimulateApp({app});
    metadata.codes[codeId] = {
      name: file.filename,
      codeId: codeId,
    };
    setSimulationMetadata({metadata});
    return codeId;
  }, [app, metadata, setSimulateApp, setSimulationMetadata]);
}


/**
 * This hook is used to instantiate a contract in the simulation state.
 */
export function useInstantiateContract() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const [trace, setTrace] = useAtom(traceState)
  return useCallback(async (sender: string, funds: Coin[], codeId: number, instantiateMsg: any) => {
    const result = await app.wasm.instantiateContract(sender, funds, codeId, instantiateMsg, trace);
    setSimulateApp({app});
    setTrace(trace);
    return result;
  }, [app, trace]);
}


/**
 * This hook is used to execute a contract in the simulation state.
 */
export function useExecute() {
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
export function useQuery() {
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
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  return useCallback(async (contractAddress: string, replyMessage: any, trace: any) => {
    const result = await app.wasm.reply(contractAddress, replyMessage, trace);
    setSimulateApp({app});
    return result;
  }, [app]);
}

/**
 * This hook is used to delete code in the simulation state.
 */
export function useDeleteCode() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const [{metadata}, setSimulationMetadata] = useAtom(simulationMetadataState);
  return useCallback((codeId: number) => {
    app.store.deleteIn(["wasm", "codes", codeId]);
    setSimulateApp({app});
    // delete code from metadata
    delete metadata.codes[codeId];
    setSimulationMetadata({metadata});
  }, [app, metadata]);
}

/**
 * This hook is used to delete instance in the simulation state.
 */
export function useDeleteInstance() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  return useCallback((contractAddress: string) => {
    app.store.deleteIn(["wasm", "contractStorage", contractAddress]);
    setSimulateApp({app});
  }, [app]);
}

export function useSetupCwSimulateAppJson() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState)
  return useCallback((json: SimulationJSON) => {
    // TODO: FIX THIS
    const app = new CWSimulateApp({
      chainId: "terra-test",
      bech32Prefix: "terra",
    });

    setSimulateApp({app});
    return app;
  }, [app]);
}

export function useDeleteAllInstances() {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState)
  return useCallback(() => {
    app.store.deleteIn(["wasm", "contractStorage"]);
    setSimulateApp({app});
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
