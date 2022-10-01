import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";

export interface SimulationMetadata {
  [chainId: string]: {
    codes: Codes;
    accounts: Accounts;
  }
}

interface Accounts {
  [accountId: string]: Account;
}

export interface Account {
  id: string;
  address: string;
  balance: number | bigint;
}

interface Codes {
  [codeName: string]: Code;
}

export interface Code {
  name: string;
  codeId: number;
}

const simulationMetadataState = atomWithStorage<SimulationMetadata>('simulationMetadata', {});

export default simulationMetadataState;

export const selectCodesMetadata = atomFamily((chainId: string) => {
  return atom(get => get(simulationMetadataState)[chainId]?.codes);
});
// export const selectCodesMetadata = atomFamily({
//   get: (chainId: string) => ({get}) => {
//     return get(simulationMetadataState)[chainId]?.codes ?? {};
//   },
// });

export const selectAccountsMetadata = atomFamily((chainId: string) => {
  return atom(get => get(simulationMetadataState)[chainId]?.accounts);
});
// export const selectAccountsMetadata = selectorFamily({
//   key: 'selectAccountsMetadata',
//   get: (chainId: string) => ({get}) => {
//     return get(simulationMetadataState)[chainId]?.accounts;
//   },
// });
