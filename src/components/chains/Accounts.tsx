import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableLayout from "./TableLayout";
import React, { useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useParams } from "react-router-dom";
import T1Container from "../grid/T1Container";
import { useAtomValue } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import { SENDER_ADDRESS } from "../../configs/constants";
import { Coin } from "@terran-one/cw-simulate/dist/types";
import { validateAccountJSON } from "../../utils/fileUtils";
import { useSetBalance } from "../../utils/simulationUtils";

const DEFAULT_VALUE = JSON.stringify(
  {
    sender: SENDER_ADDRESS,
    coins: [
      {denom: "uluna", amount: "1000"},
      {denom: "uust", amount: "10000"},
    ],
  },
  null,
  2
);

const Accounts = () => {
  const chainId = useParams().chainId!;
  const [openDialog, setOpenDialog] = useState(false);
  const [payload, setPayload] = useState(DEFAULT_VALUE);
  const setNotification = useNotification();
  const setBalance = useSetBalance();
  const {app} = useAtomValue(cwSimulateAppState);
  const accounts = app.bank.getBalances().toArray();
  const handleClickOpen = () => {
    setOpenDialog(true);
    setPayload(DEFAULT_VALUE);
  };

  const data = accounts.map((account) => {
    return {
      id: account[0],
      address: account[0],
      balances: account[1].map((c: Coin) => `${c.amount} ${c.denom}`).join(", "),
    };
  });

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddAccount = () => {
    const json = JSON.parse(payload);

    if (payload.length === 0 || !validateAccountJSON(json)) {
      setNotification("Invalid Account JSON", {severity: "error"});
      return;
    }

    if (accounts.find((acc: [string, Coin[]]) => acc[0] === json.address)) {
      setNotification("An account with this address already exists", {
        severity: "error",
      });
      return;
    }

    setBalance(json.sender, json.coins);
    setNotification("Account added successfully");
    setOpenDialog(false);
  };

  const handleDeleteAccount = (address: string) => {
    setNotification("Account successfully removed");
  };

  const handleSetPayload = (payload: string) => {
    setPayload(payload);
  };

  return (
    <>
      <Grid item container sx={{mb: 2}}>
        <Grid item flex={1}>
          <Typography variant="h4">{chainId}</Typography>
          <Typography variant="h6">Accounts</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleClickOpen}>
            New Account
          </Button>
        </Grid>
      </Grid>
      <Grid item flex={1}>
        <T1Container>
          <TableLayout
            rows={data}
            columns={{
              address: "Account Address",
              balances: "Balances",
            }}
            RowMenu={(props) => (
              <>
                <MenuItem
                  onClick={() => handleDeleteAccount(props.row.address)}
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </>
            )}
          />
        </T1Container>
      </Grid>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter account address and balance.
          </DialogContentText>
          <T1Container sx={{width: 400, height: 220}}>
            <JsonCodeMirrorEditor
              jsonValue={DEFAULT_VALUE}
              setPayload={handleSetPayload}
            />
          </T1Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAccount}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Accounts;
