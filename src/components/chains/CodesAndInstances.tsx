import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography
} from "@mui/material";
import React, { useRef, useState } from "react";
import T1Grid from "../T1Grid";
import { useRecoilState, useRecoilValue } from "recoil";
import filteredCodesByChainId from "../../selectors/filteredCodesByChainId";
import { useParams } from "react-router-dom";
import simulationState from "../../atoms/simulationState";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { createContractInstance } from "../../utils/setupSimulation";
import { base64ToArrayBuffer } from "../../utils/fileUtils";
import { snackbarNotificationState } from "../../atoms/snackbarNotificationState";

const CodesAndInstances = () => {
  const param = useParams();
  const codesAndInstances = useRecoilValue(filteredCodesByChainId(param.id as string));
  const codes = codesAndInstances.codes?.map((code: any) => code.id);
  const instances = codesAndInstances.codes?.flatMap((code: any) => code.instances)?.map((instance: any) => instance?.id).filter((instance: any) => instance !== undefined);
  const [simulation, setSimulation] = useRecoilState(simulationState);
  const [payload, setPayload] = useState<string>("");
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const [openDialog, setOpenDialog] = useState(false);
  const itemRef = useRef<any>();
  const placeholder = {
    "counter": 0,
  }
  const handleClickOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleInstantiate = () => {
    if (payload.length === 0) {
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: "Payload cannot be empty",
        severity: "error",
      });
      return;
    }
    const contractId = itemRef.current?.innerText;
    const wasmBytes = base64ToArrayBuffer(codesAndInstances.codes?.find((code: any) => code.id === contractId)?.wasmBinaryB64.split("data:application/wasm;base64,")[1]);
    const newInstantiateMsg = payload.length === 0 ? JSON.parse(payload) : placeholder;
    for (const chain in window.CWEnv.chains) {
      if (chain === param.id) {
        createContractInstance(window.CWEnv.chains[chain], wasmBytes as Buffer).then((contract) => {
          contract.instantiate({
            sender: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
            funds: []
          }, newInstantiateMsg);
        });
      }
    }
    let newSimulation = {...simulation};
    setSnackbarNotification({
      ...snackbarNotification,
      open: true,
      message: "Contract instance created",
      severity: "success",
    });
    setOpenDialog(false);
  }

  const setCodeMirrorPayload = (val: string) => {
    setPayload(val);
  }
  return (
    <>
      <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "end"}}>
          <Button variant="contained" sx={{borderRadius: 2}}>
            <Typography variant="button">Upload Code</Typography>
          </Button>
        </Grid>
      </Grid>
      <T1Grid
        childRef={itemRef}
        handleDeleteItem={() => {
        }}
        children={instances}
        items={codes}
        rightButton={
          <Button
            variant="contained"
            onClick={handleClickOpen}
            sx={{borderRadius: 2}}
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
            Enter account address and balance.
          </DialogContentText>
          <JsonCodeMirrorEditor jsonValue={""} placeholder={placeholder}
                                setPayload={setCodeMirrorPayload}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleInstantiate}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CodesAndInstances;
