import { atom, selectorFamily } from "recoil";

interface SimulationMeta {
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

const simulationMetaState = atom<SimulationMeta>({
  key: 'simulationMetaState',
  default: {},
});

export default simulationMetaState;

export const selectCodesMeta = selectorFamily({
  key: 'selectCodesMeta',
  get: (chainId: string) => ({get}) => {
    return get(simulationMetaState)[chainId]?.codes;
  },
});

export const selectAccountsMeta = selectorFamily({
  key: 'selectAccountsMeta',
  get: (chainId: string) => ({get}) => {
    return get(simulationMetaState)[chainId]?.accounts;
  },
});
