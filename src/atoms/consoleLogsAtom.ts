import { atom } from "recoil";

const consoleLogsAtom = atom({
  key: 'consoleLogsAtom',
  default: Array(),
});

export default consoleLogsAtom;