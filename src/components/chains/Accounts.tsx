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
import React, { useMemo, useState } from "react";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { validateAccountJSON } from "../../utils/fileUtils";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useParams } from "react-router-dom";
import T1Container from "../grid/T1Container";
import { Coin } from "@terran-one/cw-simulate/dist/types";

const DEFAULT_VALUE = JSON.stringify(
  {
    address: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd7",
    id: "bob",
    balances: [
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
  // TODO: FIX ME. Use BankModule instead
  const accounts: any[] = [];

  const getBalances = (): Coin[] => {
    // TODO: Fix this
    return [];
  };

  const data = useMemo(
    () =>
      accounts.map((account) => ({
        ...account,
        balances: getBalances()
        .map((c: Coin) => `${c.amount}${c.denom}`)
        ?.join(", "),
      })),
    [accounts]
  );

  const handleClickOpen = () => {
    setOpenDialog(true);
    setPayload(DEFAULT_VALUE);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAddAccount = () => {
    const json = JSON.parse(payload);

    if (payload.length === 0 || !validateAccountJSON(json)) {
      setNotification("Invalid Account JSON", {severity: "error"});
      return;
    }

    if (accounts.find((acc) => acc.id === json.id)) {
      setNotification("An account with this ID already exists", {
        severity: "error",
      });
      return;
    }

    if (accounts.find((acc) => acc.address === json.address)) {
      setNotification("An account with this address already exists", {
        severity: "error",
      });
      return;
    }

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
              id: "ID",
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
