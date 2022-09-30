import type { Code } from "../../atoms/simulationMetadataState";
import T1MenuItem from "./T1MenuItem";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { MsgInfo } from "@terran-one/cw-simulate";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useCreateContractInstance } from "../../utils/setupSimulation";
import { SENDER_ADDRESS } from "../../configs/variables";

export interface ICodeMenuItemProps {
  chainId: string;
  code: Code;
}

export default function CodeMenuItem(props: ICodeMenuItemProps) {
  const navigate = useNavigate();
  const [showInstantiateDialog, setShowInstantiateDialog] = useState(false);
  const {
    chainId,
    code,
  } = props;

  const openCloseDialog = (isOpen: boolean, close: () => void) => {
    setShowInstantiateDialog(isOpen);
    if (!isOpen) close();
  };

  return (
    <T1MenuItem
      label={code.name}
      nodeId={`${chainId}/codes/${code.name}`}
      textEllipsis
      options={[
        <MenuItem
          key="instantiate"
          onClick={() => setShowInstantiateDialog(true)}>Instantiate</MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <InstantiateDialog
          code={code}
          chainId={chainId}
          key={'instantiate-dialog'}
          open={showInstantiateDialog}
          onClose={(isOpen: boolean) => openCloseDialog(isOpen, close)}
        />
      ]}
    />
  )
}

interface IInstantiateDialogProps {
  code: Code;
  chainId: string;
  open: boolean;

  onClose(success: boolean): void;
}

function InstantiateDialog(props: IInstantiateDialogProps) {
  const {code, chainId, open, onClose} = props;
  const [payload, setPayload] = useState<string>("");
  const placeholder = {
    "count": 0
  }
  const contractName = code.name;
  const setNotification = useNotification();
  const createContractInstance = useCreateContractInstance();

  const handleInstantiate = useCallback(async () => {
    if (!code) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error(`No contract found with name ${contractName}`);
      return;
    }

    const instantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);
    const info: MsgInfo = {
      sender: SENDER_ADDRESS,
      funds: [],
    };

    try {
      await createContractInstance(chainId, code, info, instantiateMsg);
    } catch (e) {
      setNotification(`Unable to instantiate with error: ${e}`, {severity: "error"});
      console.error(e);
    }

    setNotification("Contract instance created");
    onClose(false);
  }, [payload, onClose]);
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Enter Instantiate Message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the instantiate message for the contract.
        </DialogContentText>
        <JsonCodeMirrorEditor
          jsonValue={""}
          placeholder={placeholder}
          setPayload={(val) => setPayload(val)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => onClose(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!payload}
          onClick={handleInstantiate}
        >
          Instantiate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
