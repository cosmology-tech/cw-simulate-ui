import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodesMenuItem from "./CodesMenuItem";
import InstancesMenuItem from "./InstancesMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useDeleteChainForSimulation } from "../../utils/simulationUtils";

export interface IChainMenuItemProps {
  chainId: string;
}

export default function ChainMenuItem(props: IChainMenuItemProps) {
  const {chainId} = props;

  const [showDelChain, setShowDelChain] = useState(false);
  const navigate = useNavigate();

  return (
    <T1MenuItem
      key={chainId}
      nodeId={`chains/${chainId}`}
      label={chainId}
      options={[
        <MenuItem
          key="delete-chain"
          onClick={() => {
            setShowDelChain(true);
          }}
        >
          Delete
        </MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <DeleteChainDialog
          key="delete-chain"
          chainId={chainId}
          open={showDelChain}
          onClose={() => {
            setShowDelChain(false);
            close();
            navigate('/chains');
          }}
        />,
      ]}
    >
      <T1MenuItem label="Config"
                  nodeId={`chains/${chainId}/config`}
                  link={`/chains/${chainId}/config`}/>
      <T1MenuItem label="State"
                  nodeId={`chains/${chainId}/state`}
                  link={`/chains/${chainId}/state`}/>
      <T1MenuItem label="Accounts"
                  nodeId={`chains/${chainId}/accounts`}
                  link={`/chains/${chainId}/accounts`}/>
      <CodesMenuItem chainId={chainId}/>
      <InstancesMenuItem chainId={chainId}/>
    </T1MenuItem>
  );
}

interface IDeleteChainDialogProps {
  chainId: string;
  open: boolean;

  onClose(): void;
}

function DeleteChainDialog(props: IDeleteChainDialogProps) {
  const {chainId, ...rest} = props;
  const deleteChain = useDeleteChainForSimulation();
  return (
    <Dialog {...rest}>
      <DialogTitle>Confirm Delete Chain</DialogTitle>
      <DialogContent>
        Are you absolutely certain you wish to delete chain {chainId}?
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
            deleteChain(chainId);
            rest.onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
