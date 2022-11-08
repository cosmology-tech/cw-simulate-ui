import { atom } from "jotai";

export const stateResponseTabState = atom<'request' | 'response' |'trace'|'debug'>('response');
