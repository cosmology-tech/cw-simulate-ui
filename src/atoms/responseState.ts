import { atom } from "recoil";

export const responseState = atom<JSON|undefined>({
  key: 'responseState',
  default: undefined,
});
