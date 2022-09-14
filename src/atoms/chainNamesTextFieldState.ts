import { atom } from "recoil";

const chainNamesTextFieldState = atom({
  key: 'chainNamesTextFieldState',
  default: Array<string>(),
});

export default chainNamesTextFieldState;
