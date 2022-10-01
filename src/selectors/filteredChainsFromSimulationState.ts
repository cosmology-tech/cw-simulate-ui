import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { selectAtom } from "jotai/utils";

const filteredChainsFromSimulationState =
  selectAtom(cwSimulateEnvState, (simulateEnv) => simulateEnv.chains ?? {});
export default filteredChainsFromSimulationState;
