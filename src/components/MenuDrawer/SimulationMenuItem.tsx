import React, { MouseEvent } from "react";
import T1MenuItem from "./T1MenuItem";
import { downloadJSON } from "../../utils/fileUtils";
import { useRecoilValue } from "recoil";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";

export interface ISimulationItemProps {
}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  const simulation = useRecoilValue(cwSimulateEnvState);
  const handleOnItemClick = React.useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadJSON(JSON.stringify(simulation, null, 2), "simulation.json");
  }, []);
  return <T1MenuItem nodeId="simulation" label="Download Simulation"
                     handleOnItemClick={handleOnItemClick}/>
});

export default SimulationMenuItem;
