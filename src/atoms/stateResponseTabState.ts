import { atom } from "jotai";

export const stateResponseTabState = atom<'summary' | 'response' |'calls'|'debug'>('summary');
