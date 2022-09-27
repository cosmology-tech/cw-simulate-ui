import { Code } from "../../atoms/simulationState";
import T1MenuItem from "./T1MenuItem";

export interface ICodeMenuItemProps {
  chainId: string;
  code: Code;
}
export default function CodeMenuItem(props: ICodeMenuItemProps) {
  const {
    chainId,
    code,
  } = props;
  
  return (
    <T1MenuItem
      label={code.id}
      nodeId={`${chainId}/codes/${code.id}`}
      textEllipsis
    />
  )
}
