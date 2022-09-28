import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import FileUpload from "./FileUpload";

interface IContractUploadModalProps {
  chainId: string;
  openUploadDialog: boolean;
  setOpenUploadDialog: (v: boolean) => void;
}

export default function ContractUploadModal(props: IContractUploadModalProps) {
  const { chainId, openUploadDialog, setOpenUploadDialog } = props;

  return (
    <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
      <DialogTitle>Upload Code</DialogTitle>
      <DialogContent>
        <FileUpload
          dropzoneText={"Click to upload a contract binary or Drag & drop a file here"}
          fileTypes={["application/wasm"]}
          chainId={chainId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
        <Button onClick={() => setOpenUploadDialog(false)}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
