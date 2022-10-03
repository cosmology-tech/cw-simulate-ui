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
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TableLayout from "./TableLayout";
import React, { useMemo, useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { validateAccountJSON } from "../../utils/fileUtils";
import { useNotification } from "../../atoms/snackbarNotificationState";
import simulationMetadataState, { selectAccountsMetadata } from "../../atoms/simulationMetadataState";
import { useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";
import { Coin } from "@terran-one/cw-simulate";
import { useCreateAccount, useDeleteAccount } from "../../utils/simulationUtils";

const DEFAULT_VALUE = JSON.stringify({
  "address": "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd7",
  "id": "bob",
  "balances": [
    { "denom": "uluna", "amount": "1000" },
    { "denom": "uust", "amount": "10000" },
  ]
}, null, 2);

const Accounts = () => {
  const chainId = useParams().chainId!;
  const [openDialog, setOpenDialog] = useState(false);
  const [payload, setPayload] = useState(DEFAULT_VALUE);
  const setNotification = useNotification();
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [{env}, setSimulateEnv] = useAtom(cwSimulateEnvState);
  const accounts = Object.values(useAtomValue(selectAccountsMetadata(chainId)));
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();

  const data = useMemo(
    () => accounts.map(account => ({...account, balances: Object.values(env.chains[chainId].accounts[account.address]?.balances ?? {}).map((c: Coin) => `${c.amount}${c.denom}`)?.join(', ')})),
    [accounts]
  );

  const handleClickOpen = () => {
    setOpenDialog(true);
    setPayload(DEFAULT_VALUE);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleAddAccount = () => {
    const json = JSON.parse(payload);

    if (payload.length === 0 || !validateAccountJSON(json)) {
      setNotification("Invalid Account JSON", {severity: "error"});
      return;
    }

    if (accounts.find(acc => acc.id === json.id)) {
      setNotification("An account with this ID already exists", {severity: "error"});
      return;
    }

    if (accounts.find(acc => acc.address === json.address)) {
      setNotification("An account with this address already exists", {severity: "error"});
      return;
    }

    // TODO: enforce bech32Prefix
    createAccount(json.id as string, chainId, json.address as string, json.balances as Coin[]);

    setNotification("Account added successfully");
    setOpenDialog(false);
  }

  const handleDeleteAccount = (address: string) => {
    deleteAccount(chainId, address);
    setNotification("Account successfully removed");
  }

  const handleSetPayload = (payload: string) => {
    setPayload(payload);
  }
  return (
    <>
      <Typography variant="h4">{chainId}</Typography>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter account address and balance.
          </DialogContentText>
          <JsonCodeMirrorEditor jsonValue={DEFAULT_VALUE}
                                setPayload={handleSetPayload}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAccount}>Add</Button>
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
        <TableLayout
          rows={data}
          columns={{
            id: 'ID',
            address: 'Account Address',
            balances: 'Balances',
          }}
          RowMenu={props => (
            <>
              <MenuItem onClick={() => handleDeleteAccount(props.row.address)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </>
          )}
        />
      </Grid>
    </>
  );
};

export default Accounts;
