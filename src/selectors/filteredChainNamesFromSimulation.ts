import { atom } from "jotai";
import cwSimulateEnvState from "../atoms/cwSimulateEnvState";

const filteredChainNamesFromSimulationState =
  atom((get) => Object.keys(get(cwSimulateEnvState).env.chains).sort());
export default filteredChainNamesFromSimulationState;
