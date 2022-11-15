import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { ContractInfo } from "@terran-one/cw-simulate";
import { useCallback } from "react";
import { useContracts, compareDeep } from "../../CWSimulationBridge";
import useSimulation from "../../hooks/useSimulation";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";

export interface IInstancesSubMenuProps {}

export default function InstancesSubMenu(props: IInstancesSubMenuProps) {
  const sim = useSimulation();
  const instances = Object.values(useContracts(sim, compareDeep));
  
  return (
    <>
      <SubMenuHeader title="Instances" />
      {instances && instances.map(info => (
        <InstanceMenuItem
          key={info.address}
          instance={info}
        />
      ))}
    </>
  )
}

interface IInstanceMenuItemProps {
  instance: ContractInfo;
}

function InstanceMenuItem({ instance }: IInstanceMenuItemProps) {
  // TODO: find contract name from instance
  const copyToClipboard = useCallback((data: string) => navigator.clipboard?.writeText(data), []);

  return (
    <T1MenuItem
      label={instance.address}
      textEllipsis
      link={`/instances/${instance.address}`}
      tooltip={`${""} ${instance.address}`}
      options={({close}) => [
        <MenuItem
          key="copy-address"
          onClick={() => {
            copyToClipboard(instance.address);
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
