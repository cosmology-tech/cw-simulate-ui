import { atom } from "recoil";

export const blockState = atom<JSON | undefined>({
  key: 'blockState',
  default: undefined,
});
