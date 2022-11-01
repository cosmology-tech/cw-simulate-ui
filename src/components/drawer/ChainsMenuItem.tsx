import { useAtomValue } from "jotai";
import { useState } from "react";
import ChainMenuItem from "./ChainMenuItem";
import T1MenuItem from "./T1MenuItem";
import CwSimulateAppState from "../../atoms/cwSimulateAppState";

export interface IChainsItemProps {

}

export default function ChainsMenuItem(props: IChainsItemProps) {
  const {app} = useAtomValue(CwSimulateAppState);
  const chainNames = [app.chainId];
  const [menuEl, setMenuEl] = useState<HTMLUListElement | null>(null);

  return (
    <T1MenuItem
      nodeId="chains"
      label="Chains"
      menuRef={setMenuEl}
    >
      {chainNames.map((chain, i) => (
        <ChainMenuItem chainId={chain} key={`chain${i}`}/>
      ))}
    </T1MenuItem>
  )
}
