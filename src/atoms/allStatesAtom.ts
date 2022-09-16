import { atom } from "recoil";

export interface IState {
  chainStateBefore: string;
  payload: string;
  currentTab: string;
  chainStateAfter: string;
  res: JSON | undefined;
}


export const allStatesAtom = atom<IState[]>({
  key: 'allStates',
  default: [],
});
