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

interface IProps {
  accounts: { [key: string]: Coin[] };
  account: string;
  changeAccount: (val: string) => void;
}
const AccountPopover = ({ account, changeAccount, accounts }: IProps) => {
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleDiffClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDiffClose = () => {
    setAnchorEl(null);
  };

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
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6b5f5f",
          },
        }}
      >
        <Autocomplete
          onInputChange={(_, value) => changeAccount(value)}
          sx={{ width: "100%", padding: 1 }}
          value={account}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <TextField {...params} label="Sender" />
          )}
          options={Object.keys(accounts)}
        />
      </Popover>
    </>
  );
};
export default AccountPopover;
