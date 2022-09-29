import type { Code } from "../../atoms/simulationMetadataState";
import T1MenuItem from "./T1MenuItem";
import { MenuItem } from "@mui/material";

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
      label={code.name}
      nodeId={`${chainId}/codes/${code.name}`}
      textEllipsis
      options={[
        <MenuItem
          key="instantiate">Instantiate</MenuItem>,
      ]}
      // TODO: Add dialog for instantiate message
    />
  )
}
