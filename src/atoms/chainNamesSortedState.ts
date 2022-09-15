import { selector } from "recoil";
import chainNamesTextFieldState from "./chainNamesTextFieldState";

const chainNamesSortedState = selector({
  key: "chainNamesSortedState",
  get: ({get}) => {
    return [...get(chainNamesTextFieldState)].sort();
  },
});

export default chainNamesSortedState;
