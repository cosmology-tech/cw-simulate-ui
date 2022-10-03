import filteredInstancesFromChainId from "../../selectors/filteredInstancesFromChainId";
import InstanceMenuItem from "./InstanceMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { useDeleteAllInstancesForSimulation } from "../../utils/simulationUtils";

export interface IInstancesMenuItemProps {
  chainId: string;
}

export default function InstancesMenuItem(props: IInstancesMenuItemProps) {
  const {chainId} = props;
  const [showDeleteInstance, setShowDeleteInstance] = useState(false);
  const navigate = useNavigate();
  const instances = useAtomValue(filteredInstancesFromChainId(chainId));
  if (!instances.length) {
    return <></>
  }

  return (
    <T1MenuItem
      label="Instances"
      nodeId={`${chainId}/instances`}
      link={`/chains/${chainId}/codes`}
      textEllipsis
      options={[
        <MenuItem
          key="delete-all-instance"
          onClick={() => {
            setShowDeleteInstance(true);
          }}>Delete All</MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <DeleteInstancesDialog
          key="delete-instance"
          onClose={() => {
            setShowDeleteInstance(false);
            close();
            navigate('/chains');
          }}
          open={showDeleteInstance}
          chainId={chainId}
        />,
      ]}
    >
      {instances.map(instance => (
        <InstanceMenuItem
          key={instance.contractAddress}
          chainId={chainId}
          instance={instance}
        />
      ))}
    </T1MenuItem>
  )
}

interface IDeleteInstanceDialogProps {
  chainId: string;
  open: boolean;

  onClose(): void;
}

function DeleteInstancesDialog(props: IDeleteInstanceDialogProps) {
  const {chainId, ...rest} = props;
  const deleteAllInstances = useDeleteAllInstancesForSimulation();
  return (
    <Dialog {...rest}>
      <DialogTitle>Confirm Delete All Instances</DialogTitle>
      <DialogContent>
        Are you absolutely certain you wish to delete all instances?
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            rest.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            deleteAllInstances(chainId);
            rest.onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
