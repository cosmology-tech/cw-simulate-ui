import React, { ComponentType, MouseEventHandler, ReactNode, useCallback } from "react";
import { useRecoilValue } from "recoil";
import simulationState from "../../atoms/simulationState";
import { downloadJSON } from "../../utils/fileUtils";
import T1MenuItem from "./T1MenuItem";

export interface ISimulationItemProps {
  /** Component/element type to use as root item. Defaults to `T1MenuItem` */
  component?: ComponentType<ISimulationItemComponentProps>;
}

export interface ISimulationItemComponentProps {
  nodeId: string;
  label: string;
}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  const {
    component: Component = T1MenuItem,
  } = props;
  
  const simulation = useRecoilValue(simulationState);
  
  const handleDownloadSim = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      downloadJSON(JSON.stringify(simulation, null, 2), "simulation.json");
    },
    [simulation]
  );
  
  return <Component nodeId="simulation" label="Simulation" />
});

export default SimulationMenuItem;
