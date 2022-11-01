import { atom } from "jotai";

export interface IExecutionHistory{
    request:any;
    response:any;
    state:any;
}
export interface IExecutionHistoryState {
    [key:string]:IExecutionHistory[];
}
export const executionHistoryState = atom<IExecutionHistoryState>({});
