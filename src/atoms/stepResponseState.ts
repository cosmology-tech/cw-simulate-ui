import { ContractResponse } from "@terran-one/cw-simulate";
import { atom } from "jotai";

export const stepResponseState = atom<{ ok: ContractResponse; } | { error: any; }| undefined>(undefined);
