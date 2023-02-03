import DeleteIcon from "@mui/icons-material/Delete";
import CachedIcon from "@mui/icons-material/Cached";
import TuneIcon from "@mui/icons-material/Tune";
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
import { generateRandomWallet } from "../../utils/cryptoUtils";
import { useBind } from "../../utils/reactUtils";
import { stringifyFunds } from "../../utils/typeUtils";
import GenerateWalletDialog from "../dialogs/GenerateWalletDialog";
import Funds from "../Funds";
import T1Container from "../grid/T1Container";
import Address from "./Address";
import DialogButton, { IDialogProps } from "../DialogButton";
import TableLayout from "./TableLayout";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const Accounts = () => {
  const sim = useSimulation();
  const accounts = Object.entries(useAccounts(sim));
  const setNotification = useNotification();

  const data = accounts.map(([address, account]) => {
    return {
      id: address,
      label: account.label ?? "",
      address: <Address address={address} long />,
      funds: stringifyFunds(account.funds),
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
              variant: "contained",
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

                <MenuItem disableRipple>
                  <DialogButton
                    DialogComponent={EditFundsDialog}
                    ComponentProps={{
                      dialogprops: {
                        address: props.row.address.props.address,
                        funds: props.row.funds,
                      },
                    }}
                    sx={{
                      p: 0,
                      textTransform: "initial",
                      color: "unset",
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </DialogButton>
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

interface AccountDialogState extends AccountEx {
  mnemonic?: string;
  derivationPath: string;
}

type AccountDataAction =
  | SetAccountLabelAction
  | SetAccountAddressAction
  | SetAccountFundsAction;
type SetAccountLabelAction = {
  type: "set/label";
  value: string;
};
type SetAccountAddressAction = {
  type: "set/address";
  address: string;
  mnemonic?: string;
  derivationPath?: string;
};
type SetAccountFundsAction = {
  type: "set/funds";
  value: Coin[];
};

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
    (state: AccountDialogState, action: AccountDataAction) => {
      switch (action.type) {
        case "set/label": {
          return {
            ...state,
            label: action.value,
          };
        }
        case "set/address": {
          return {
            ...state,
            address: action.address,
            mnemonic: action.mnemonic ?? state.mnemonic,
            derivationPath: action.derivationPath ?? state.derivationPath,
          };
        }
        case "set/funds": {
          return {
            ...state,
            funds: action.value,
          };
        }
      }
    },
    {
      address: "",
      funds: defaultAccount.funds ?? [],
      label: "",
      derivationPath: "m/44'/1'/0'/0",
    }
  );

  const [isFundsValid, setFundsValid] = useState(true);

  const addAccount = useCallback(() => {
    if (!account.address.trim()) {
      setNotification("Please specify an account address.", {
        severity: "error",
      });
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
    generateRandomWallet(sim.bech32Prefix, account.derivationPath).then(
      ({ address, mnemonic }) => {
        dispatch({ type: "set/address", address, mnemonic });
      }
    );
  }, []);

  const valid =
    !!account.address.trim() && isFundsValid && !!account.funds.length;
  const MyGenerateWalletDialog = useBind(GenerateWalletDialog, {
    onFinish(r) {
      const { address, mnemonic, derivationPath } = r;
      dispatch({ type: "set/address", address, mnemonic, derivationPath });
    },
  });

  // Generate a random address on initial mount. As this is asynchronous, we have no other choice than to useEffect.
  useEffect(() => {
    open && generateAddress();
  }, [open]);

  return (
    <Dialog open={!!open} onClose={onClose}>
      <DialogTitle>Add New Account</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 2,
          minWidth: 380,
          pt: "8px !important",
        }}
      >
        <TextField
          label="Address"
          required
          value={account.address}
          onChange={(e) => {
            dispatch({ type: "set/address", address: e.target.value });
          }}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <IconButton onClick={generateAddress}>
                    <CachedIcon />
                  </IconButton>
                </InputAdornment>
                <InputAdornment position="end">
                  <DialogButton
                    Component={IconButton}
                    DialogComponent={MyGenerateWalletDialog}
                  >
                    <TuneIcon />
                  </DialogButton>
                </InputAdornment>
              </>
            ),
          }}
        />
        <TextField
          label="Label"
          onChange={(e) => {
            dispatch({ type: "set/label", value: e.target.value });
          }}
        />
        <Funds
          onChange={(funds) => {
            dispatch({ type: "set/funds", value: funds });
          }}
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
interface EditFundsDialogProps {
  open?: boolean;
  onClose(): void;
  dialogprops?: IDialogProps;
}

function EditFundsDialog({ open, onClose, dialogprops }: EditFundsDialogProps) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const [newFunds, setNewFunds] = useState<Coin[]>([]);
  const [isFundsValid, setFundsValid] = useState(true);
  const saveFunds = useCallback(() => {
    if (dialogprops?.address) {
      try {
        console.log(newFunds);
        sim.setBalance(dialogprops?.address, newFunds);
        setNotification("Funds updated successfully");
      } catch (err: any) {
        setNotification(err.message, { severity: "error" });
      }
    }
  }, [newFunds, isFundsValid]);
  return (
    <Dialog open={!!open} onClose={onClose}>
      <DialogTitle>Update Funds</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 2,
          minWidth: 380,
          pt: "8px !important",
        }}
      >
        <TextField
          label="Address"
          required
          aria-readonly
          value={dialogprops?.address}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <AccountBalanceIcon />
                </InputAdornment>
              </>
            ),
          }}
        />
        <Funds
          defaultValue={dialogprops?.funds}
          onChange={setNewFunds}
          onValidate={setFundsValid}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={saveFunds}
          disabled={!isFundsValid || !newFunds.length}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
