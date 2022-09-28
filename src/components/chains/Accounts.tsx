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
import { useRecoilValue, useSetRecoilState } from "recoil";
import React, { useMemo, useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { validateAccountJSON } from "../../utils/fileUtils";
import { useNotification } from "../../atoms/snackbarNotificationState";
import simulationMetadataState, { selectAccountsMeta } from "../../atoms/simulationMetadataState";

const DEFAULT_VALUE = JSON.stringify({
  "address": "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd7",
  "balance": 100000000,
  "id": "bob"
}, null, 2);

export interface IAccountsProps {
  chainId: string;
}

const Accounts = ({chainId}: IAccountsProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [payload, setPayload] = useState(DEFAULT_VALUE);
  const setNotification = useNotification();

  const setSimulationMetadata = useSetRecoilState(simulationMetadataState);
  const accounts = Object.values(useRecoilValue(selectAccountsMeta(chainId)));
  const data = useMemo(() =>
      accounts.map(account => ({...account, balance: account.balance + ''})),
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
      setNotification("Invalid Account JSON", { severity: "error" });
      return;
    }

    if (accounts.find(acc => acc.id === json.id)) {
      setNotification("An account with this ID already exists", { severity: "error" });
      return;
    }

    if (accounts.find(acc => acc.address === json.address)) {
      setNotification("An account with this address already exists", { severity: "error" });
      return;
    }

    // TODO: enforce bech32Prefix
    setSimulationMetadata(prev => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        accounts: {
          ...prev[chainId].accounts,
          [json.id]: {
            id: json.id as string,
            address: json.address as string,
            balance: 100000000,
          },
        },
      },
    }));

    setNotification("Account added successfully");
    setOpenDialog(false);
  }

  const handleDeleteAccount = (id: string) => {
    setSimulationMetadata(prev => ({
      ...prev,
      [chainId]: {
        ...prev[chainId],
        accounts: Object.fromEntries(
          Object.entries(prev[chainId].accounts).filter(
            ([accountId, account]) => accountId !== id
          )
        ),
      },
    }));
    setNotification("Account successfully removed");
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
            balance: 'Balance',
          }}
          RowMenu={props => (
            <>
              <MenuItem onClick={() => handleDeleteAccount(props.row.id)}>
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
