import cwSimulateEnvState from "../atoms/cwSimulateEnvState";
import { focusAtom } from "jotai/optics";

const filteredChainsFromSimulationState = focusAtom(cwSimulateEnvState, (optic) => optic.prop("chains") ?? {});

export default filteredChainsFromSimulationState;
