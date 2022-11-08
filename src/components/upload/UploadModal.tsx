import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, styled } from "@mui/material";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";
import simulationMetadataState from "../../atoms/simulationMetadataState";
import { useNotification } from "../../atoms/snackbarNotificationState";
import {
  SimulationJSON,
  useSetupCwSimulateAppJson,
  useStoreCode
} from "../../utils/simulationUtils";
import FileUpload from "./FileUpload";
import { SENDER_ADDRESS } from "../../configs/constants";
import FileUploadPaper from "./FileUploadPaper";

interface IUploadModalProps {
  dropzoneText?: string;
  variant: 'simulation' | 'contract' | 'both';
  dropTitle?: string;
  chainId?: string;
  open: boolean;

  onClose(success: boolean): void;
}

export default function UploadModal(props: IUploadModalProps) {
  const {dropzoneText, variant, dropTitle, chainId, open, onClose} = props;
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [file, setFile] = useState<{ filename: string, fileContent: Buffer | JSON } | undefined>();
  const setNotification = useNotification();
  const storeCode = useStoreCode();
  const setupSimulation = useSetupCwSimulateAppJson();
  const handleAdd = useCallback(async () => {
    if (!file) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error('no file uploaded');
      return;
    }

    if (variant === 'contract') {
      storeCode(SENDER_ADDRESS, file);
    } else if (variant === 'simulation') {
      try {
        const json = file.fileContent as any as SimulationJSON;
        await setupSimulation(json);
      } catch (e: any) {
        setNotification(e.message, {severity: "error"});
        console.error(e);
        onClose(true);
      }
    }
    onClose(true);
  }, [file, onClose, setNotification, setSimulationMetadata, storeCode, variant, chainId]);

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{dropTitle ?? 'Upload Code'}</DialogTitle>
      <DialogContent sx={{ width: '50vw', maxWidth: 600 }}>
        <FileUploadPaper sx={{ width: '100%', minHeight: 180 }}>
          <FileUpload
            dropzoneText={dropzoneText ?? "Click to upload a contract binary or Drag & drop a file here"}
            variant={variant ?? 'contract'}
            onAccept={(filename: string, fileContent: Buffer | JSON) => {
              setFile({filename, fileContent});
            }}
            onClear={() => {
              setFile(undefined);
            }}
          />
        </FileUploadPaper>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleAdd} disabled={!file} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
