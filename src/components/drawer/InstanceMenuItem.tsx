import T1MenuItem from "./T1MenuItem";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { useDeleteInstance, } from "../../utils/simulationUtils";

export interface IInstanceMenuItemProps {
  instance: string;
}

export default function InstanceMenuItem(props: IInstanceMenuItemProps) {
  const {
    instance,
  } = props;
  const [showDeleteInstance, setShowDeleteInstance] = useState(false);
  const navigate = useNavigate();
  return (
    <T1MenuItem
      label={instance}
      nodeId={`terra-test/instances/${instance}`}
      link={`/chains/terra-test/instances/${instance}`}
      textEllipsis
      tooltip={`${instance}`}
      options={[
        <MenuItem
          key="delete-instance"
          onClick={() => {
            setShowDeleteInstance(true);
          }}>Delete</MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <DeleteInstanceDialog
          key="delete-instance"
          onClose={() => {
            setShowDeleteInstance(false);
            close();
            navigate('/chains');
          }}
          open={showDeleteInstance}
          instanceAddress={instance}
        />,
      ]}
    />
  )
}

interface IDeleteInstanceDialogProps {
  instanceAddress: string;
  open: boolean;

  onClose(): void;
}

function DeleteInstanceDialog(props: IDeleteInstanceDialogProps) {
  const {instanceAddress, ...rest} = props;
  const deleteInstance = useDeleteInstance();
  return (
    <Dialog {...rest}>
      <DialogTitle>Confirm Delete Instance</DialogTitle>
      <DialogContent>
        Are you absolutely certain you wish to delete instance {instanceAddress}?
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
            deleteInstance(instanceAddress);
            rest.onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
