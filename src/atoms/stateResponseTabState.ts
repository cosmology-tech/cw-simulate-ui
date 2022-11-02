import { atom } from "jotai";

export const stateResponseTabState = atom<'state' | 'request' | 'response' |'trace'|'debug'>('state');
