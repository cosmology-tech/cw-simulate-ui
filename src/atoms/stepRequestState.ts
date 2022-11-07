import { Coin, ExecuteEnv } from "@terran-one/cw-simulate";
import { atom } from "jotai";

export interface IRequest {
    env:ExecuteEnv,
    info:{
        sender: string;
        funds: Coin[];
    } | {},
    executeMsg:any
}

export const stepRequestState = atom<IRequest | undefined>(undefined);
