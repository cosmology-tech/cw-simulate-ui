import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import T1Grid from "../T1Grid";
import { useRecoilValue } from "recoil";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useCreateContractInstance } from "../../utils/setupSimulation";
import { useNotification } from "../../atoms/snackbarNotificationState";
import FileUpload from "../FileUpload";
import filteredInstancesFromChainId from "../../selectors/filteredInstancesFromChainId";
import { MsgInfo } from "@terran-one/cw-simulate";
import { selectCodesMeta } from "../../atoms/simulationMetadataState";

export interface ICodesAndInstancesProps {
  chainId: string;
}

const CodesAndInstances = ({
  chainId,
}: ICodesAndInstancesProps) => {
  const codes = useRecoilValue(selectCodesMeta(chainId));
  const instances = useRecoilValue(filteredInstancesFromChainId(chainId));
  const createContractInstance = useCreateContractInstance();
  const [payload, setPayload] = useState<string>("");
  const setNotification = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const itemRef = useRef<any>();

  const placeholder = { count: 0 };

  const handleInstantiate = async () => {
    if (payload.length === 0) {
      setNotification("Payload cannot be empty", { severity: "error" });
      return;
    }

    // TODO: I hate any...
    const contractName: string = itemRef.current?.innerText;
    const code = codes[contractName];
    if (!code) {
      setNotification("Internal error. Please check logs.", { severity: "error" });
      console.error(`No contract found with name ${contractName}`);
      return;
    }

    const instantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);
    const info: MsgInfo = {
      sender: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
      funds: [],
    };

    try {
      createContractInstance(chainId, code, info, instantiateMsg);
    }
    catch (e) {
      setNotification(`Unable to instantiate with error: ${e}`, { severity: "error" });
      console.error(e);
    }

    setNotification("Contract instance created");
    setOpenDialog(false);
  };

  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 2 }}
            onClick={() => setOpenUploadDialog(true)}
          >
            <Typography variant="button">Upload Code</Typography>
          </Button>
        </Grid>
      </Grid>
      <T1Grid
        childRef={itemRef}
        handleDeleteItem={() => {}}
        children={instances.map(instance => instance.contractAddress)}
        items={Object.keys(codes).sort()}
        rightButton={
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="button">Instantiate</Typography>
          </Button>
        }
        hasRightDeleteButton={true}
        useLinks={false}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter Instantiate Message</DialogTitle>
        <DialogContent sx={{ height: "20vh" }}>
          <DialogContentText>
            Enter the instantiate message for the contract.
          </DialogContentText>
          <JsonCodeMirrorEditor
            jsonValue={""}
            placeholder={placeholder}
            setPayload={(val: string) => setPayload(val)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleInstantiate}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)}>
        <DialogTitle>Upload Code</DialogTitle>
        <DialogContent>
          <FileUpload
            dropzoneText={
              "Click to upload a contract binary or Drag & drop a file here"
            }
            fileTypes={["application/wasm"]}
            chainId={chainId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenUploadDialog(false)}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CodesAndInstances;
