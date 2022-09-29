import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useState } from "react";
import { useNotification } from "../atoms/snackbarNotificationState";
import { useStoreCode } from "../utils/setupSimulation";
import FileUpload from "./FileUpload";

interface IUploadModalProps {
  dropzoneText?: string;
  variant?: 'simulation' | 'contract' | 'both';
  dropTitle?: string;
  chainId: string;
  open: boolean;

  onClose(success: boolean): void;
}

export default function UploadModal(props: IUploadModalProps) {
  const {dropzoneText, variant, dropTitle, chainId, open, onClose} = props;

  const [file, setFile] = useState<{ filename: string, buffer: Buffer } | undefined>();
  const setNotification = useNotification();
  const storeCode = useStoreCode();

  const handleAdd = useCallback(() => {
    if (!file) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error('no file uploaded');
      return;
    }

    storeCode(chainId, file.filename, file.buffer)
    onClose(true);
  }, [file, onClose]);

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{dropTitle ?? 'Upload Code'}</DialogTitle>
      <DialogContent>
        <FileUpload
          dropzoneText={dropzoneText ?? "Click to upload a contract binary or Drag & drop a file here"}
          variant={variant ?? 'contract'}
          onAccept={(filename: string, buffer: Buffer) => {
            setFile({filename, buffer});
          }}
          onClear={() => {
            setFile(undefined);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleAdd} disabled={!file}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
