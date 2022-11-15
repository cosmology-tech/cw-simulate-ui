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
import { Coin } from "@terran-one/cw-simulate/dist/types";
import React, { useState } from "react";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { defaults } from "../../configs/constants";
import useSimulation from "../../hooks/useSimulation";
import { useAccounts } from "../../CWSimulationBridge";
import { validateAccountJSON } from "../../utils/fileUtils";
import T1Container from "../grid/T1Container";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import TableLayout from "./TableLayout";

const DEFAULT_VALUE = JSON.stringify(
  {
    sender: defaults.chains.terra.sender,
    coins: defaults.chains.terra.funds,
  },
  null,
  2
);

const Accounts = () => {
  const sim = useSimulation();
  const accounts = Object.entries(useAccounts(sim) ?? {});
  const setNotification = useNotification();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [payload, setPayload] = useState(DEFAULT_VALUE);
  const handleClickOpen = () => {
    setOpenDialog(true);
    setPayload(DEFAULT_VALUE);
  };

  const data = accounts.map(([address, balances]) => {
    return {
      address,
      balances: balances.map((c: Coin) => `${c.amount} ${c.denom}`).join(", "),
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

    sim.setBalance(json.sender, json.coins);
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
            keyField="address"
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
