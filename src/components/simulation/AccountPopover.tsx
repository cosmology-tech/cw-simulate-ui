import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { Coin } from "@terran-one/cw-simulate";
import React, { useState } from "react";
import { stringifyFunds } from "../../utils/typeUtils";
import Accounts from "../Accounts";
import Funds from "../Funds";

interface IProps {
  account: string;
  funds: Coin[];
  onChange?(account: string, funds: Coin[]): void;
  // TODO: validate account + funds?
  // currently only validates funds
  onValidate?(valid: boolean): void;
}

const AccountPopover = ({
  account,
  funds,
  onChange,
  onValidate,
}: IProps) => {
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  
  const onChangeAccount = (account: string, balance: Coin[]) => {
    onChange?.(account, funds);
  };
  
  const onChangeFunds = (funds: Coin[]) => {
    onChange?.(account, funds);
  };

  return (
    <>
      <IconButton ref={setAnchorEl} onClick={() => setOpen(true)}>
        <AccountBalanceWalletOutlinedIcon />
      </IconButton>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
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
        <Accounts defaultAccount={account} onChange={onChangeAccount} />
        <Funds
          defaultValue={stringifyFunds(funds)}
          onChange={onChangeFunds}
          onValidate={onValidate}
          sx={{ mt: 2 }}
        />
      </Popover>
    </>
  );
};
export default AccountPopover;
