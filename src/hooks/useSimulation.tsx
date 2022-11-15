import React, { PropsWithChildren, useContext, useRef } from "react";
import CWSimulationBridge from "../CWSimulationBridge";

const SimulationContext = React.createContext(new CWSimulationBridge());

export function CWSimulationProvider({ children }: PropsWithChildren) {
  const bridge = useRef(new CWSimulationBridge());
  
  return (
    <SimulationContext.Provider value={bridge.current}>
      {children}
    </SimulationContext.Provider>
  )
}

const useSimulation = () => useContext(SimulationContext);
export default useSimulation;
