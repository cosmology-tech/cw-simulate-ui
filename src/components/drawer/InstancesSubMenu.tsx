import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useAtomValue } from "jotai";
import { useCallback } from "react";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";
import simulationMetadataState from "../../atoms/simulationMetadataState";

export interface IInstancesSubMenuProps {}

export default function InstancesSubMenu(props: IInstancesSubMenuProps) {
  const {app} = useAtomValue(cwSimulateAppState);
  // @ts-ignore
  const instances = app.store.getIn(["wasm", "contractStorage"])?.toArray().map(i => i[0]);
  const simulationMetadata = useAtomValue(simulationMetadataState);
  return (
    <>
      <SubMenuHeader title="Instances" />
      {instances && instances.map((instance: string) => (
        <InstanceMenuItem
          key={instance}
          instance={instance}
        />
      ))}
    </>
  )
}

interface IInstanceMenuItemProps {
  instance: string;
}

function InstanceMenuItem({ instance }: IInstanceMenuItemProps) {
  // TODO: find contract name from instance
  const copyToClipboard = useCallback((data: string) => navigator.clipboard?.writeText(data), []);

  return (
    <T1MenuItem
      label={instance}
      textEllipsis
      link={`/instances/${instance}`}
      tooltip={`${""} ${instance}`}
      options={({close}) => [
        <MenuItem
          key="copy-address"
          onClick={() => {
            copyToClipboard(instance);
            close();
          }}
          disabled={!navigator.clipboard}
        >
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          <ListItemText>
            Copy address
          </ListItemText>
        </MenuItem>
      ]}
    />
  )
}
