import { atom } from "jotai";

type UIState = {
  dark: boolean;
}

const uiState = atom<UIState>({
  dark: false,
});
export default uiState;
