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
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useDeleteCode, useInstantiateContract } from "../../utils/simulationUtils";
import { SENDER_ADDRESS } from "../../configs/variables";
import { useNavigate } from "react-router-dom";
import T1Container from "../grid/T1Container";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import { useAtom } from "jotai";

export interface ICodeMenuItemProps {
  chainId: string;
  code: Code;
}

export default function CodeMenuItem(props: ICodeMenuItemProps) {
  const navigate = useNavigate();
  const [showInstantiateDialog, setShowInstantiateDialog] = useState(false);
  const [showDeleteCodeDialog, setShowDeleteCodeDialog] = useState(false);
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
        <MenuItem
          key="delete"
          onClick={() => setShowDeleteCodeDialog(true)}>Delete</MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <DeleteCodeDialog
          code={code}
          key="delete-code-dialog"
          open={showDeleteCodeDialog}
          onClose={() => {
            setShowDeleteCodeDialog(false);
            close();
            navigate('/');
          }}
        />,
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

interface IDeleteCodeDialogProps {
  code: Code;
  open: boolean;

  onClose(): void;
}

function DeleteCodeDialog(props: IDeleteCodeDialogProps) {
  const {code, open, onClose} = props;
  const deleteCode = useDeleteCode();
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Confirm Delete Code</DialogTitle>
      <DialogContent>
        Are you absolutely certain you wish to delete code {code.name}?
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            deleteCode(code.codeId);
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface IInstantiateDialogProps {
  code: Code;
  chainId: string;
  open: boolean;

  onClose(success: boolean): void;
}

function InstantiateDialog(props: IInstantiateDialogProps) {
  const {code, chainId, open, onClose} = props;
  const navigate = useNavigate();
  const [payload, setPayload] = useState<string>("");
  const placeholder = {
    "count": 0
  }
  const contractName = code.name;
  const setNotification = useNotification();
  const createContractInstance = useInstantiateContract();
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const handleInstantiate = useCallback(async () => {
    if (!code) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error(`No contract found with name ${contractName}`);
      return;
    }

    const instantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);

    try {
      const instance = await createContractInstance(SENDER_ADDRESS, [], app.wasm.lastCodeId, instantiateMsg);
      const contractAddress: string = instance?.unwrap().events[0].attributes[0].value;
      setNotification(`Successfully instantiated ${contractName} with address ${contractAddress}`);
      onClose(false);
      navigate(`/instances/${contractAddress}`);
    } catch (e: any) {
      setNotification(`Unable to instantiate with error: ${e.message}`, {severity: "error"});
    }
  }, [payload, onClose]);
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Enter Instantiate Message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the instantiate message for the contract.
        </DialogContentText>
        <T1Container sx={{width: 400, height: 220}}>
          <JsonCodeMirrorEditor
            jsonValue={""}
            placeholder={placeholder}
            setPayload={(val) => setPayload(val)}
          />
        </T1Container>
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
