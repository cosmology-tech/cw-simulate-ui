import {
  Autocomplete,
  AutocompleteRenderInputParams,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { Coin } from "@terran-one/cw-simulate";
import React from "react";

interface IAccountsDropDown {
  onChange?: (val: string) => void;
  defaultValue?: string;
  accounts: { [key: string]: Coin[] };
  label?: string;
  sx?: SxProps<Theme>;
}
const AccountsDropDown = ({
  onChange,
  defaultValue,
  accounts,
  label,
  sx,
}: IAccountsDropDown) => {
  return (
    <Autocomplete
      onInputChange={(_, value) => onChange?.(value)}
      sx={{ ...sx, width: "100%" }}
      defaultValue={defaultValue ? defaultValue : Object.keys(accounts)[0]}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={label ? label : "Sender"} />
      )}
      options={Object.keys(accounts)}
    />
  );
};

export default AccountsDropDown;
