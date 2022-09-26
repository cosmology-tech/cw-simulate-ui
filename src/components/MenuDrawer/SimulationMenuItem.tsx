import React, { MouseEventHandler, useCallback } from "react";
import { useRecoilValue } from "recoil";
import simulationState from "../../atoms/simulationState";
import { downloadJSON } from "../../utils/fileUtils";
import T1MenuItem from "./T1MenuItem";

export interface ISimulationItemProps {}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  const simulation = useRecoilValue(simulationState);
  
  const handleDownloadSim = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      downloadJSON(JSON.stringify(simulation, null, 2), "simulation.json");
    },
    [simulation]
  );
  
  return <T1MenuItem nodeId="simulation" label="Simulation" link />
});

export default SimulationMenuItem;
