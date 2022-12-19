import { useAtomValue } from "jotai";
import React, { ReactNode, useContext, useEffect, useRef } from "react";
import { lastChainIdState } from "../atoms/simulationPageAtoms";
import { useNotification } from "../atoms/snackbarNotificationState";
import CWSimulationBridge from "../CWSimulationBridge";
import { BlockedError, useSession } from "./useSession";

const SimulationContext = React.createContext(new CWSimulationBridge());

export interface ICWSimulationProviderProps {
  children?: ReactNode;
  /** Optional persistence key for localStorage */
  persist?: string;
  /** Interval in ms in which to save session */
  saveInterval?: number;
}

export function CWSimulationProvider({ children, persist, saveInterval = 600000 }: ICWSimulationProviderProps) {
  const bridge = useRef(new CWSimulationBridge());
  const setNotification = useNotification();
  const lastChainId = useAtomValue(lastChainIdState);
  const session = useSession();
  
  useEffect(() => {
    if (!persist || !session || !lastChainId) return;
    if (!window.indexedDB) {
      setNotification(
        'Your browser does not support IndexedDB. Session cannot be persisted.',
        {
          severity: 'warning',
          autoHideDuration: 20000,
        },
      );
      return;
    }
    
    lastChainId && setNotification('Attempting to restore existing session...', { severity: 'info' });
    
    session.load(bridge.current, lastChainId)
      .then(() => {
        setNotification('Last session successfully restored');
      })
      .catch(err => {
        if (err instanceof BlockedError) {
          setNotification(`IndexedDB connection blocked. Please close other CWSimulate tabs.`, { severity: 'error' });
        } else {
          setNotification(`Failed to establish IndexedDB connection: ${err?.message ?? 'unknown error'}`, { severity: 'error' });
        }
      });
  }, [session]);
  
  // TODO: Session currently takes quite long to save as we're re-serializing unchanged data every single time
  // which includes wasm bytecode in the order of millions of bytes
  // we should identify which parts of the data store have been changed and only re-serialize those, which will avoid
  // re-serializing several MB of binary data
  // once we have that back we can re-enable auto-saving
  
  // useEffect(() => {
  //   if (!persist || !session || !lastChainId || !window.indexedDB) return;
  //   let isAlive = true;
  //   let timeout: ReturnType<typeof setTimeout> | undefined;
    
  //   const save = async () => {
  //     setNotification('Autosaving, app may be unresponsive...', { severity: 'info' });
  //     await session?.save(bridge.current);
  //     setNotification('Autosave complete');
  //     if (isAlive) timeout = setTimeout(save, saveInterval);
  //   }
  //   timeout = setTimeout(save, saveInterval);
    
  //   return () => {
  //     isAlive = false;
  //     clearTimeout(timeout);
  //     session?.save(bridge.current);
  //   }
  // }, [session, lastChainId]);
  
  return (
    <SimulationContext.Provider value={bridge.current}>
      {children}
    </SimulationContext.Provider>
  )
}

const useSimulation = () => useContext(SimulationContext);
export default useSimulation;
