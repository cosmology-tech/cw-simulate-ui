import { atom } from "jotai";

export interface SimulationMetadata {
  codes: Codes;
  accounts: Accounts;
}

interface Accounts {
  [accountId: string]: Account;
}

export interface Account {
  id: string;
  address: string;
}

export interface Codes {
  [key: number]: Code;
}

export interface Code {
  name: string;
  codeId: number;
}

const simulationMetadataState = atom({metadata: {codes: {}, accounts: {}} as SimulationMetadata});

export default simulationMetadataState;
