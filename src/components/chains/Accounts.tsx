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
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import filteredAccountsByChainId from "../../selectors/filteredAccountsByChainId";
import React, { useMemo, useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import simulationState, { Account } from "../../atoms/simulationState";
import { validateAccountJSON } from "../../utils/fileUtils";
import { snackbarNotificationState } from "../../atoms/snackbarNotificationState";

const DEFAULT_VALUE = JSON.stringify({
  "address": "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd7",
  "balance": 100000000,
  "id": "bob"
}, null, 2);

const Accounts = () => {
  const param = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [simulation, setSimulation] = useRecoilState(simulationState);
  const [payload, setPayload] = useState(DEFAULT_VALUE);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  
  const accounts = useRecoilValue(filteredAccountsByChainId(param.id as string)).accounts;
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
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: "Invalid Account JSON",
        severity: "error",
      });
      return;
    }
    
    if (accounts.find(acc => acc.id === json.id)) {
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: 'An account with this ID already exists',
        severity: 'error',
      });
      return;
    }
    
    if (accounts.find(acc => acc.address === json.address)) {
      setSnackbarNotification({
        ...snackbarNotification,
        open: true,
        message: 'An account with this address already exists',
        severity: 'error',
      });
      return;
    }
    
    // TODO: enforce bech32Prefix
    
    setSimulation({
      ...simulation,
      simulation: {
        ...simulation.simulation,
        chains: simulation.simulation.chains.map((chain: any) => {
          if (chain.chainId !== param.id)
            return chain;
          return {
            ...chain,
            accounts: [...(chain.accounts||[]), JSON.parse(payload)],
          };
        }),
      },
    });
    
    setSnackbarNotification({
      ...snackbarNotification,
      open: true,
      message: "Account added successfully",
      severity: "success",
    });
    setOpenDialog(false);
  }
  
  const handleDeleteAccount = (id: string) => {
    setSimulation({
      ...simulation,
      simulation: {
        ...simulation.simulation,
        chains: simulation.simulation.chains.map(chain => {
          if (chain.chainId !== param.id) return chain;
          return {
            ...chain,
            accounts: chain.accounts.filter(acc => acc.id !== id),
          };
        }),
      },
    });
    
    setSnackbarNotification({
      ...snackbarNotification,
      open: true,
      message: 'Account successfully removed',
      severity: 'success',
    });
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
                  <DeleteIcon fontSize="small" />
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
