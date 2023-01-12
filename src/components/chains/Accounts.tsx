import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Coin } from "@terran-one/cw-simulate/dist/types";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { AccountEx, useAccounts } from "../../CWSimulationBridge";
import useSimulation from "../../hooks/useSimulation";
import { getDefaultAccount } from "../../utils/commonUtils";
import { generateRandomAddress } from "../../utils/cryptoUtils";
import { stringifyFunds } from "../../utils/typeUtils";
import Funds from "../Funds";
import T1Container from "../grid/T1Container";
import Address from "./Address";
import DialogButton from "../DialogButton";
import TableLayout from "./TableLayout";

const Accounts = () => {
  const sim = useSimulation();
  const accounts = Object.entries(useAccounts(sim));
  const setNotification = useNotification();

  const data = accounts.map(([address, account]) => {
    return {
      id: address,
      label: account.label ?? '',
      address: <Address address={address} long />,
      funds: stringifyFunds(account.funds)
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
          <DialogButton
            DialogComponent={AddAccountDialog}
            ComponentProps={{
              variant: 'contained',
            }}
          >
            New Account
          </DialogButton>
        </Grid>
      </Grid>
      <Grid item flex={1}>
        <T1Container>
          <TableLayout
            rows={data}
            columns={{
              label: "Account Label",
              address: "Account Address",
              funds: "Funds",
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
    </>
  );
};

export default Accounts;

type AccountDataAction = SetAccountLabelAction | SetAccountAddressAction | SetAccountFundsAction;
type SetAccountLabelAction = {
  type: 'set/label';
  value: string;
}
type SetAccountAddressAction = {
  type: 'set/address';
  value: string;
}
type SetAccountFundsAction = {
  type: 'set/funds';
  value: Coin[];
}

interface AddAccountDialogProps {
  open?: boolean;
  onClose(): void;
}

function AddAccountDialog({ open, onClose }: AddAccountDialogProps) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const accounts = Object.entries(useAccounts(sim));
  const defaultAccount = getDefaultAccount(sim.chainId);
  
  const [account, dispatch] = useReducer(
    (state: AccountEx, action: AccountDataAction) => {
      switch (action.type) {
        case 'set/label': {
          return {
            ...state,
            label: action.value,
          };
        }
        case 'set/address': {
          return {
            ...state,
            address: action.value,
          };
        }
        case 'set/funds': {
          return {
            ...state,
            funds: action.value,
          }
        }
      }
    },
    {
      address: '',
      funds: defaultAccount.funds ?? [],
      label: '',
    }
  );

  const [isFundsValid, setFundsValid] = useState(true);

  const addAccount = useCallback(() => {
    if (!account.address.trim()) {
      setNotification(
        "Please specify an account address.",
        { severity: "error" },
      );
      return;
    }
    
    if (!isFundsValid) {
      // it should even be possible to call addAccount w/ invalid funds, but still
      setNotification(
        "Invalid funds. Please see the message underneath funds input.",
        { severity: "error" }
      );
      return;
    }
    
    // TODO: validate bech32

    if (accounts.find(([addr]) => addr === account.address)) {
      setNotification("An account with this address already exists", {
        severity: "error",
      });
      return;
    }

    sim.setAccountLabel(account.address, account.label);
    sim.setBalance(account.address, account.funds);
    setNotification("Account added successfully");
    onClose();
  }, [accounts, account, isFundsValid]);
  
  const generateAddress = useCallback(() => {
    generateRandomAddress(sim.bech32Prefix).then(addr => {
      dispatch({ type: 'set/address', value: addr });
    });
  }, []);

  const valid = !!account.address.trim() && isFundsValid && !!account.funds.length;
  
  // Generate a random address on initial mount. As this is asynchronous, we have no other choice than to useEffect.
  useEffect(() => {open && generateAddress()}, [open]);

  return (
    <Dialog open={!!open} onClose={onClose}>
      <DialogTitle>Add New Account</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2, minWidth: 380, pt: '8px !important' }}>
        <TextField
          label="Address"
          required
          value={account.address}
          onChange={e => {dispatch({ type: 'set/address', value: e.target.value })}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={generateAddress}>
                  <CachedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Label"
          onChange={e => {dispatch({ type: 'set/label', value: e.target.value })}}
        />
        <Funds
          onChange={funds => {dispatch({ type: 'set/funds', value: funds })}}
          onValidate={setFundsValid}
          hideError={!account.funds.length}
          defaultValue={stringifyFunds(defaultAccount.funds)}
        />
        {!account.funds.length && (
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
