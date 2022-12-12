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
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Coin } from "@terran-one/cw-simulate/dist/types";
import React, { useCallback, useRef, useState } from "react";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { getDefaultAccount } from "../../utils/commonUtils";
import { useAccounts } from "../../CWSimulationBridge";
import useSimulation from "../../hooks/useSimulation";
import { stringifyFunds } from "../../utils/typeUtils";
import T1Container from "../grid/T1Container";
import TableLayout from "./TableLayout";
import Funds from "../Funds";
import Address from "./Address";

const Accounts = () => {
  const sim = useSimulation();
  const accounts = Object.entries(useAccounts(sim));
  const setNotification = useNotification();

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const data = accounts.map(([address, balances]) => {
    return {
      id: address,
      address: <Address address={address} long />,
      balances: balances.map((c: Coin) => `${c.amount} ${c.denom}`).join(", "),
    };
  });

  const handleDeleteAccount = (address: string) => {
    sim.deleteBalance(address);
    setNotification("Account successfully removed");
  };

  return (
    <>
      <Grid item container sx={{ mb: 2 }}>
        <Grid item flex={1}>
          <Typography variant="h6">Accounts</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
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
                  onClick={() =>
                    handleDeleteAccount(props.row.address.props.address)
                  }
                >
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </>
            )}
          />
        </T1Container>
      </Grid>
      <AddAccountDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </>
  );
};

export default Accounts;

interface DialogProps {
  open: boolean;
  onClose(): void;
}

function AddAccountDialog({ open, onClose }: DialogProps) {
  const sim = useSimulation();
  const accounts = Object.entries(useAccounts(sim));
  const defaultAccount = getDefaultAccount(sim.chainId);

  const refAddress = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState(defaultAccount.sender);
  const [funds, setFunds] = useState<Coin[]>(defaultAccount.funds);
  const [isFundsValid, setFundsValid] = useState(true);

  const setNotification = useNotification();

  const handleChangeAddress = useCallback(() => {
    if (refAddress.current) setAddress(refAddress.current.value);
  }, []);

  const addAccount = useCallback(() => {
    if (!funds.length) {
      setNotification("Please specify funds for the new account.", {
        severity: "error",
      });
      return;
    }

    if (!isFundsValid) {
      setNotification(
        "Invalid funds. Please see the message underneath funds input.",
        { severity: "error" }
      );
      return;
    }

    if (accounts.find(([addr]) => addr === address)) {
      setNotification("An account with this address already exists", {
        severity: "error",
      });
      return;
    }

    sim.setBalance(address, funds);
    setNotification("Account added successfully");
    onClose();
  }, [accounts, address, funds, isFundsValid]);

  const valid = isFundsValid && !!funds.length;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Account</DialogTitle>
      <DialogContent sx={{ minWidth: 380 }}>
        <TextField
          inputRef={refAddress}
          label="Address"
          defaultValue={defaultAccount.sender}
          onChange={handleChangeAddress}
          sx={{ width: "100%", my: 2 }}
        />
        <Funds
          onChange={setFunds}
          onValidate={setFundsValid}
          hideError={!funds.length}
          defaultValue={stringifyFunds(defaultAccount.funds)}
        />
        {!funds.length && (
          <DialogContentText color="red" fontStyle="italic">
            Please enter funds.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={addAccount} disabled={!valid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
