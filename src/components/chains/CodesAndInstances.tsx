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
import React, { useEffect, useRef, useState } from "react";
import T1Grid from "../T1Grid";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import simulationState, { cloneSimulation } from "../../atoms/simulationState";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useChains, useCreateContractInstance, useInstantiate, useCodeIds, useInstanceAddresses, useWasmBytecode } from "../../utils/setupSimulation";
import { base64ToArrayBuffer } from "../../utils/fileUtils";
import { useNotification } from "../../atoms/snackbarNotificationState";
import FileUpload from "../FileUpload";

const CodesAndInstances = () => {
  const param = useParams();

  const [simulation, setSimulation] = useRecoilState(simulationState);
  const codeIds = useCodeIds(param.id!);
  const instanceAddresses = useInstanceAddresses(param.id!);

  const instantiate = useInstantiate();
  const simulateEnvChains = useChains();
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

    const contractId = itemRef.current?.innerText as string;
    const binary = useWasmBytecode(param.id!, parseInt(contractId));
    if (!binary) {
      setNotification("Failed to extract WASM bytecode", { severity: "error" });
      return;
    }

    const wasmBytes = base64ToArrayBuffer(binary);
    const newInstantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);

    for (const chainId in simulateEnvChains) {
      if (chainId === param.id) {
        const contract = await createContractInstance(simulateEnvChains[chainId], wasmBytes as Buffer);
        const info = {
          sender: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
          funds: [],
        };

        try {
          instantiate(chainId, contract, info, newInstantiateMsg);
        } catch (e) {
          setNotification(`Unable to instantiate with ${e}`, { severity: "error" });
          console.error(e);
        }
      }
    }

    const contractInstances = simulateEnvChains[param.id as string].contracts;
    const allInstances: any[] = [];

    for (const key in contractInstances) {
      // Build instances array for the contract
      allInstances.push({
        id: contractInstances[key].contractAddress,
        message: contractInstances[key].executionHistory[0].request.instantiateMsg,
      });
    }

    const _simulation_ = cloneSimulation(simulation, param.id!, contractId, allInstances);

    setSimulation(_simulation_);
    setNotification("Contract instance created");
    setOpenDialog(false);
  };

  useEffect(() => {
    setSimulation(simulation);
  }, [simulation]);

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
        children={instanceAddresses}
        items={codeIds}
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
