import React from "react";
import { downloadJSON } from "../../utils/fileUtils";
import T1MenuItem from "./T1MenuItem";

export interface ISimulationItemProps {}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  // TODO: call `downloadJSON` (fileUtils) to download a valid copy of the simulation
  return <T1MenuItem nodeId="simulation" label="Simulation" link />
});

export default SimulationMenuItem;
