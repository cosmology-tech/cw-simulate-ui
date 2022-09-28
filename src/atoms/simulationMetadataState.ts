import { atom, selectorFamily } from "recoil";

interface SimulationMetadata {
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

const simulationMetadataState = atom<SimulationMetadata>({
  key: 'simulationMetadataState',
  default: {},
});

export default simulationMetadataState;

export const selectCodesMetadata = selectorFamily({
  key: 'selectCodesMetadata',
  get: (chainId: string) => ({get}) => {
    return get(simulationMetadataState)[chainId]?.codes;
  },
});

export const selectAccountsMetadata = selectorFamily({
  key: 'selectAccountsMetadata',
  get: (chainId: string) => ({get}) => {
    return get(simulationMetadataState)[chainId]?.accounts;
  },
});
