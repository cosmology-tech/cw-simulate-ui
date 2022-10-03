import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { selectAtom } from "jotai/utils";

const filteredChainsFromSimulationState =
  selectAtom(
    cwSimulateEnvState,
    ({env}) => env.chains,
    () => false,
  );
export default filteredChainsFromSimulationState;
