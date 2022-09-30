import { CWContractInstance } from "@terran-one/cw-simulate";
import T1MenuItem from "./T1MenuItem";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteInstanceForSimulation } from "../../utils/setupSimulation";

export interface IInstanceMenuItemProps {
  chainId: string;
  instance: CWContractInstance;
}

export default function InstanceMenuItem(props: IInstanceMenuItemProps) {
  const [showDeleteInstance, setShowDeleteInstance] = useState(false);
  const navigate = useNavigate();
  const {
    chainId,
    instance,
  } = props;
  return (
    <T1MenuItem
      label={instance.contractAddress}
      nodeId={`${chainId}/instances/${instance.contractAddress}`}
      link={`/chains/${chainId}/instances/${instance.contractAddress}`}
      textEllipsis
      options={[
        <MenuItem
          key="delete-instance"
          onClick={() => {
            setShowDeleteInstance(true);
          }}>Delete</MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <DeleteInstanceDialog
          chain={chainId}
          address={instance.contractAddress}
          key="delete-instance"
          onClose={() => {
            setShowDeleteInstance(false);
            close();
            navigate('/chains');
          }}
          open={showDeleteInstance} />,
      ]}
    />
  )
}

interface IDeleteInstanceDialogProps {
  open: boolean;
  chain: string;
  address: string;

  onClose(): void;
}

function DeleteInstanceDialog(props: IDeleteInstanceDialogProps) {
  const {...rest} = props;
  const deleteInstance = useDeleteInstanceForSimulation();

  return (
    <Dialog {...rest}>
      <DialogTitle>Confirm Delete Instance</DialogTitle>
      <DialogContent>
        Are you absolutely certain you wish to delete instance?
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
            deleteInstance(rest.chain, rest.address);
            rest.onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
