import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const {persistAtom} = recoilPersist();
const simulationState = atom({
  key: 'simulationState',
  default: {
    chains: []
  },
  effects_UNSTABLE: [persistAtom]
});

export default simulationState;
