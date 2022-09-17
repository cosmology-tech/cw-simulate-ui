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
import TableLayout from "./TableLayout";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import filteredAccountsByChainId from "../../selectors/filteredAccountsByChainId";
import React, { useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import simulationState from "../../atoms/simulationState";
import { validateAccountJSON } from "../../utils/fileUtils";
import { snackbarNotificationState } from "../../atoms/snackbarNotificationState";

const columnNames = ["ID", "Account Address", "Balance"];
const Accounts = () => {
  const param = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [simulation, setSimulation] = useRecoilState(simulationState);
  const [payload, setPayload] = useState("");
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const accounts = useRecoilValue(filteredAccountsByChainId(param.id as string)).accounts;
  const placeholder = {
    "address": "0x0000000000000000000000000000000000000000",
    "balance": "100000000",
    "id": "bob"
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handAddAccount = () => {
    if (payload.length === 0 || !validateAccountJSON(JSON.parse(payload))) {
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: "Invalid Account JSON",
        severity: "error",
      });
      return;
    }
    let newSimulation = {...simulation};
    const newAccounts = newSimulation.simulation.chains.find((chain: any) => chain.chainId === param.id)?.accounts;
    newSimulation = {
      ...newSimulation,
      simulation: {
        ...newSimulation.simulation,
        chains: newSimulation.simulation.chains.map((chain: any) => {
          if (chain.chainId === param.id) {
            return {
              ...chain,
              accounts: [...newAccounts, JSON.parse(payload)]
            }
          }
          return chain;
        })
      }
    }
    setSimulation(newSimulation);
    setSnackbarNotification({
      ...snackbarNotification,
      open: true,
      message: "Account added successfully",
      severity: "success",
    });
    setOpenDialog(false);
  }

  const handleSetPayload = (payload: string) => {
    setPayload(payload);
  }
  return (
    <>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter account address and balance.
          </DialogContentText>
          <JsonCodeMirrorEditor jsonValue={""} placeholder={placeholder}
                                setPayload={handleSetPayload}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handAddAccount}>Add</Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "end"}}>
          <Button variant="contained" onClick={handleClickOpen}>
            <Typography variant="button">New Account</Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{mt: 4}}>
        <TableLayout rows={accounts} columns={columnNames}/>
      </Grid>
    </>
  );
};

export default Accounts;
