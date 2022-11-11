import { useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import type { Codes, SimulationMetadata } from "../atoms/simulationMetadataState";
import simulationMetadataState from "../atoms/simulationMetadataState";
import { AsJSON } from "./typeUtils";
import { CWSimulateApp } from "@terran-one/cw-simulate";
import { Coin } from "@terran-one/cw-simulate/dist/types";
import cwSimulateAppState from "../atoms/cwSimulateAppState";
import { CWSimulateAppOptions } from "@terran-one/cw-simulate/dist/CWSimulateApp";
import { traceState } from "../atoms/simulationPageAtoms";
import {
  DEFAULT_INJECTIVE_ADDRESS,
  DEFAULT_INJECTIVE_FUNDS,
  DEFAULT_JUNO_ADDRESS,
  DEFAULT_JUNO_FUNDS,
  DEFAULT_OSMOSIS_ADDRESS,
  DEFAULT_OSMOSIS_FUNDS,
  DEFAULT_TERRA_ADDRESS,
  DEFAULT_TERRA_FUNDS,
  InjectiveConfig,
  JunoConfig,
  OsmosisConfig,
  TerraConfig
} from "../configs/constants";

export type SimulationJSON = AsJSON<{
  simulationMetadata: SimulationMetadata;
}>

export interface AddressAndFunds {
  address: string;
  funds: Coin[];
}

/**
 * This hook is used to initialize the simulation state.
 */
export function useCreateNewSimulateApp() {
  const setSimulateApp = useSetAtom(cwSimulateAppState);
  return useCallback((options: CWSimulateAppOptions) => {
    const app = new CWSimulateApp({
      chainId: options.chainId,
      bech32Prefix: options.bech32Prefix
    });

    setSimulateApp({app});
    return app;
  }, []);
}

/**
 * This hook is used to store new WASM bytecode in the simulation state.
 */
export function useStoreCode() {
  const setSimulateApp = useSetAtom(cwSimulateAppState);
  const setSimulationMetadata = useSetAtom(simulationMetadataState);
  return useCallback((addressAndFunds: AddressAndFunds, file: { filename: string, fileContent: Buffer | JSON }) => {
    let codeId: number;
    setSimulateApp(({app}) => {
      codeId = app.wasm.create(addressAndFunds.address, file.fileContent as Buffer);
      app.bank.setBalance(addressAndFunds.address, addressAndFunds.funds);
      return {app};
    });

    setSimulationMetadata(({metadata}) => {
      metadata.codes[codeId] = {
        name: file.filename,
        codeId: codeId,
      };
      return {metadata};
    });

    //@ts-ignore
    return codeId;
  }, []);
}

export function useSetBalance() {
  const setSimulateApp = useSetAtom(cwSimulateAppState);
  return useCallback((addr: string, funds: Coin[]) => {
    setSimulateApp(({app}) => {
      app.bank.setBalance(addr, funds);
      return {app};
    });
  }, []);
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
    setSimulateApp(({app}) => {
      // TODO: WE CAN'T DELETE CODE YET. FIX LATER.
      app.store.deleteIn(["wasm", "codes", codeId]);
      return {app};
    });

    setSimulationMetadata(({metadata}) => {
      delete metadata.codes[codeId];
      return {metadata};
    });
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

export function getAddressAndFunds(chainId: string | undefined): AddressAndFunds {
  switch (chainId) {
    case TerraConfig.chainId:
      return {address: DEFAULT_TERRA_ADDRESS, funds: DEFAULT_TERRA_FUNDS};
    case JunoConfig.chainId:
      return {address: DEFAULT_JUNO_ADDRESS, funds: DEFAULT_JUNO_FUNDS};
    case OsmosisConfig.chainId:
      return {address: DEFAULT_OSMOSIS_ADDRESS, funds: DEFAULT_OSMOSIS_FUNDS};
    case InjectiveConfig.chainId:
      return {address: DEFAULT_INJECTIVE_ADDRESS, funds: DEFAULT_INJECTIVE_FUNDS};
    default:
      return {address: DEFAULT_TERRA_ADDRESS, funds: DEFAULT_TERRA_FUNDS};
  }
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
