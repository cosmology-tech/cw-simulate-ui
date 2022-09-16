import { atom } from "recoil";

const simulationState = atom({
  key: 'simulationState',
  default: {
    chains: []
  }
});

export default simulationState;
