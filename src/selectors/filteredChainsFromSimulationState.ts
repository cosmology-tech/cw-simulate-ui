import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { selectAtom } from "jotai/utils";
import deepEquals from "fast-deep-equal";

const filteredChainsFromSimulationState =
  selectAtom(cwSimulateEnvState, (simulateEnv) => simulateEnv.chains ?? {}, deepEquals);
export default filteredChainsFromSimulationState;
