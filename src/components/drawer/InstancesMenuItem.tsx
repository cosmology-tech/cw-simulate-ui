import InstanceMenuItem from "./InstanceMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { useDeleteAllInstances } from "../../utils/simulationUtils";
import { useAtomValue } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";

export interface IInstancesMenuItemProps {
  chainId: string;
}

export default function InstancesMenuItem(props: IInstancesMenuItemProps) {
  const {chainId} = props;
  const [showDeleteInstance, setShowDeleteInstance] = useState(false);
  const navigate = useNavigate();
  const {app} = useAtomValue(cwSimulateAppState);
  // @ts-ignore
  const instances = app.store.getIn(["wasm", "contractStorage"])?.toArray().map(i => i[0]);
  if (!instances?.length) {
    return <></>
  }

  return (
    <T1MenuItem
      label="Instances"
      nodeId={`${chainId}/instances`}
      link={'codes'}
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
            navigate('/');
          }}
          open={showDeleteInstance}
        />,
      ]}
    >
      {instances.map((instance: string) => (
        <InstanceMenuItem
          chainId={chainId}
          key={instance}
          instance={instance}
        />
      ))}
    </T1MenuItem>
  )
}

interface IDeleteInstanceDialogProps {
  open: boolean;

  onClose(): void;
}

function DeleteInstancesDialog(props: IDeleteInstanceDialogProps) {
  const {...rest} = props;
  const deleteAllInstances = useDeleteAllInstances();
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
            deleteAllInstances();
            rest.onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
