import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useCallback, useState } from "react";
import Item from "./item";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { SimulationJSON, useSetupSimulationJSON, useStoreCode } from "../../utils/simulationUtils";
import FileUpload from "./FileUpload";

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
  const [file, setFile] = useState<{ filename: string, fileContent: Buffer | JSON } | undefined>();
  const setNotification = useNotification();
  const storeCode = useStoreCode();
  const setupSimulation = useSetupSimulationJSON();
  const handleAdd = useCallback(async () => {
    if (!file) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error('no file uploaded');
      return;
    }

    if (variant === 'contract') {
      if (chainId != null) {
        storeCode(chainId, file.filename, file.fileContent as Buffer);
      }
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
  }, [file, storeCode, variant, chainId]);

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{dropTitle ?? 'Upload Code'}</DialogTitle>
      <DialogContent>
        <Grid
          item
          xs={11}
          lg={7}
          md={8}
          sx={{marginTop: 4, marginBottom: 4, width: "100%"}}
        >
          <Item sx={{border: "1px solid #eae5e5", padding: 0}}>
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
          </Item>
        </Grid>
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
