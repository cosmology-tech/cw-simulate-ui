import React, { useState } from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Popover,
  TextField,
} from "@mui/material";
import { Coin } from "@terran-one/cw-simulate";
import Funds from "../Funds";
import { stringifyFunds } from "../../utils/typeUtils";

interface IProps {
  accounts: { [key: string]: Coin[] };
  changeAccount: (val: string) => void;
  changeFunds?(funds: Coin[]): void;
  account: string;
  funds: Coin[];
}

const AccountPopover = ({
  changeAccount,
  accounts,
  changeFunds,
  account,
  funds,
}: IProps) => {
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleDiffClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDiffClose = () => {
    setAnchorEl(null);
  };

  const [_, setFundsValid] = useState(true);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Button aria-describedby="abcd" onClick={handleDiffClick}>
        <AccountBalanceWalletOutlinedIcon sx={{ color: "white" }} />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleDiffClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          "& .MuiPopover-paper ": {
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 4px 4px !important",
            width: "20vw",
            p: 1,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6b5f5f",
          },
        }}
      >
        <Autocomplete
          onInputChange={(_, value) => changeAccount(value)}
          value={account}
          sx={{ width: "100%" }}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField {...params} label="Sender" />
          )}
          options={Object.keys(accounts)}
        />
        <Funds
          defaultValue={stringifyFunds(funds)}
          onChange={changeFunds}
          onValidate={setFundsValid}
          sx={{ mt: 2 }}
        />
      </Popover>
    </>
  );
};
export default AccountPopover;
