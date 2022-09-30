import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useState } from "react";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useStoreCode } from "../../utils/setupSimulation";
import FileUpload from "./FileUpload";
import { useSetRecoilState } from "recoil";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";
import simulationMetadataState from "../../atoms/simulationMetadataState";
import { ISimulationJSON } from "../drawer/SimulationMenuItem";
import { CWSimulateEnv } from "@terran-one/cw-simulate";

interface IUploadModalProps {
  dropzoneText?: string;
  variant?: 'simulation' | 'contract' | 'both';
  dropTitle?: string;
  chainId?: string;
  open: boolean;

  onClose(success: boolean): void;
}

export default function UploadModal(props: IUploadModalProps) {
  const {dropzoneText, variant, dropTitle, chainId, open, onClose} = props;
  const setSimulationEnv = useSetRecoilState(cwSimulateEnvState);
  const setSimulationMetadata = useSetRecoilState(simulationMetadataState);
  const [file, setFile] = useState<{ filename: string, fileContent: Buffer | JSON } | undefined>();
  const setNotification = useNotification();
  const storeCode = useStoreCode();

  const handleAdd = useCallback(() => {
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
      const json = file.fileContent as unknown as ISimulationJSON;
      setSimulationEnv(file.fileContent as unknown as CWSimulateEnv);
      setSimulationMetadata(json.simulationMetadata);
    }
    onClose(true);
  }, [file, onClose]);

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{dropTitle ?? 'Upload Code'}</DialogTitle>
      <DialogContent>
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
