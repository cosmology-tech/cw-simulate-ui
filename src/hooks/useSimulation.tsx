import React, { ReactNode, useContext, useRef } from "react";
import CWSimulationBridge from "../CWSimulationBridge";

const SimulationContext = React.createContext(new CWSimulationBridge());

export interface ICWSimulationProviderProps {
  children?: ReactNode;
}

export function CWSimulationProvider({ children }: ICWSimulationProviderProps) {
  const bridge = useRef(new CWSimulationBridge());
  
  return (
    <SimulationContext.Provider value={bridge.current}>
      {children}
    </SimulationContext.Provider>
  )
}

const useSimulation = () => useContext(SimulationContext);
export default useSimulation;
