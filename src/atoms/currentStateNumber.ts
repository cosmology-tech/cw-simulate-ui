import { atom } from "recoil";

export const currentStateNumber = atom<number>({
  key: 'currentState',
  default: 0,
});
