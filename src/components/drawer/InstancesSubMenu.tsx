import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { ContractInfo } from "@terran-one/cw-simulate";
import copy from "copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { drawerSubMenuState } from "../../atoms/uiState";
import { useContracts, compareDeep } from "../../CWSimulationBridge";
import useSimulation from "../../hooks/useSimulation";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";
import { useSetAtom } from "jotai";

export interface IInstancesSubMenuProps {}

export default function InstancesSubMenu(props: IInstancesSubMenuProps) {
  const sim = useSimulation();
  const instances = Object.values(useContracts(sim, compareDeep)).filter(inst => !inst.hidden);
  
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
  const sim = useSimulation();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const setDrawerSubMenu = useSetAtom(drawerSubMenuState);
  
  const code = sim.useWatcher(
    ({ wasm }) => {
      const contractInfo = wasm.getContractInfo(instance.address);
      if (!contractInfo) return null;
      
      const code = wasm.getCodeInfo(contractInfo.codeId);
      if (!code || code.hidden) return null;
      return code;
    },
    compareDeep,
    undefined,
    [instance.address],
  );

  return (
    <T1MenuItem
      label={instance.address}
      textEllipsis
      link={`/instances/${instance.address}`}
      onClick={() => {setDrawerSubMenu(undefined)}}
      tooltip={
        <>
          {code
          ? <Typography variant="body2" fontWeight="bold">
              {code.name} ({code.codeId})
            </Typography>
          : <Typography variant="body2" fontStyle="italic">
              {'<'}Deleted Code{'>'}
            </Typography>
          }
          <Typography variant="caption">
            {instance.address}
          </Typography>
        </>
      }
      tooltipProps={{
        componentsProps: {
          tooltip: {
            style: {
              maxWidth: 'none',
            },
          },
        },
      }}
      options={({close}) => [
        <MenuItem
          key="copy-address"
          onClick={() => {
            copy(instance.address);
            setNotification("Copied to clipboard", { severity: "info" });
            close();
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          <ListItemText>
            Copy address
          </ListItemText>
        </MenuItem>,
        <MenuItem
          key="delete"
          onClick={() => {
            sim.hideContract(instance.address);
            navigate('/accounts');
            close();
          }}
        >
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText>
            Delete
          </ListItemText>
        </MenuItem>
      ]}
    />
  )
}
