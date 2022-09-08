import { atom } from "recoil";
import { CWChain } from "@terran-one/cw-simulate";

export const chainsState = atom({
  key: 'chainsState',
  default: Array<CWChain>(),
});
