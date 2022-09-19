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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import filteredCodesByChainId from "../../selectors/filteredCodesByChainId";
import { useParams } from "react-router-dom";
import simulationState from "../../atoms/simulationState";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { createContractInstance } from "../../utils/setupSimulation";
import { base64ToArrayBuffer } from "../../utils/fileUtils";
import {
  showNotification,
  snackbarNotificationState,
} from "../../atoms/snackbarNotificationState";
import FileUpload from "../FileUpload";

const CodesAndInstances = () => {
  const param = useParams();
  const codesAndInstances = useRecoilValue(
    filteredCodesByChainId(param.id as string)
  );
  const codes = codesAndInstances?.codes?.map((code) => code.id);
  const instances = codesAndInstances?.codes
    ?.flatMap((code) => code.instances)
    ?.map((instance) => instance.id)
    .filter((instance) => !!instance);
  const [simulation, setSimulation] = useRecoilState(simulationState);
  const [payload, setPayload] = useState<string>("");
  const setSnackbarNotification = useSetRecoilState(snackbarNotificationState);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const itemRef = useRef<any>();
  const placeholder = {
    count: 0,
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClickOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  const handleInstantiate = () => {
    if (payload.length === 0) {
      showNotification(
        setSnackbarNotification,
        "Payload cannot be empty",
        "error"
      );
      return;
    }
    const contractId = itemRef.current?.innerText;
    const binary = codesAndInstances.codes
      ?.find((code: any) => code.id === contractId)
      ?.wasmBinaryB64.split("data:application/wasm;base64,")[1];
    if (!binary) {
      showNotification(
        setSnackbarNotification,
        "Failed to extract WASM bytecode",
        "error"
      );
      return;
    }

    const wasmBytes = base64ToArrayBuffer(binary);
    const newInstantiateMsg =
      payload.length === 0 ? JSON.parse(payload) : placeholder;
    for (const chain in window.CWEnv.chains) {
      if (chain === param.id) {
        createContractInstance(
          window.CWEnv.chains[chain],
          wasmBytes as Buffer
        ).then((contract) => {
          try {
            contract.instantiate(
              {
                sender: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
                funds: [],
              },
              newInstantiateMsg
            );
          } catch (e) {
            showNotification(
              setSnackbarNotification,
              "Unable to instantiate with " + e,
              "error"
            );
          }
        });
      }
    }

    const contractInstances = window.CWEnv.chains[param.id as string].contracts;
    const allInstances: any[] = [];
    for (const key in contractInstances) {
      // Build instances array for the contract
      allInstances.push({
        id: contractInstances[key].contractAddress,
        message:
          contractInstances[key].executionHistory[0].request.instantiateMsg,
      });
    }
    setSimulation({
      ...simulation,
      simulation: {
        ...simulation.simulation,
        chains: simulation.simulation.chains.map((chain: any) => {
          if (chain.chainId === param.id) {
            return {
              ...chain,
              codes: chain.codes.map((code: any) => {
                if (code.id === contractId) {
                  return {
                    ...code,
                    instances: allInstances,
                  };
                }
                return code;
              }),
            };
          }
          return chain;
        }),
      },
    });
    showNotification(setSnackbarNotification, "Contract instance created");
    setOpenDialog(false);
  };

  const setCodeMirrorPayload = (val: string) => {
    setPayload(val);
  };

  const handleUpload = () => {
    setOpenUploadDialog(false);
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
            onClick={handleClickOpenUploadDialog}
          >
            <Typography variant="button">Upload Code</Typography>
          </Button>
        </Grid>
      </Grid>
      <T1Grid
        childRef={itemRef}
        handleDeleteItem={() => {}}
        children={instances}
        items={codes}
        rightButton={
          <Button
            variant="contained"
            onClick={handleClickOpen}
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="button">Instantiate</Typography>
          </Button>
        }
        hasRightDeleteButton={true}
      />
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Enter Instantiate Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the instantiate message for the contract.
          </DialogContentText>
          <JsonCodeMirrorEditor
            jsonValue={""}
            placeholder={placeholder}
            setPayload={setCodeMirrorPayload}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleInstantiate}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog}>
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
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button onClick={handleUpload}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CodesAndInstances;
