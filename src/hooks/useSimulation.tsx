import { useAtomValue } from "jotai";
import React, { ReactNode, useContext, useEffect, useRef } from "react";
import { lastChainIdState } from "../atoms/simulationPageAtoms";
import { useNotification } from "../atoms/snackbarNotificationState";
import CWSimulationBridge from "../CWSimulationBridge";
import { BlockedError, useSession } from "./useSession";

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
