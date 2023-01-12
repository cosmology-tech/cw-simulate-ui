import {
  Autocomplete,
  AutocompleteRenderInputParams,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import React from "react";
import { AccountEx, useAccounts } from "../CWSimulationBridge";
import useSimulation from "../hooks/useSimulation";
import { joinSx } from "../utils/reactUtils";

interface IAccounts {
  defaultAccount?: string;
  label?: string;
  sx?: SxProps<Theme>;
  onChange?(account: AccountEx | null): void;
}

const Accounts = ({
  defaultAccount,
  label,
  sx,
  onChange,
}: IAccounts) => {
  const sim = useSimulation();
  const accounts = useAccounts(sim);
  
  return (
    <Autocomplete<AccountEx>
      defaultValue={defaultAccount ? accounts[defaultAccount] : Object.values(accounts)[0]}
      options={Object.values(accounts)}
      getOptionLabel={(option) => option.label?.trim() || option.address}
      onChange={(_, value) => onChange?.(value)}
      isOptionEqualToValue={(option, value) => option.address === value.address}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={label || "Sender"} />
      )}
      sx={joinSx({ width: "100%" }, sx)}
    />
  );
};

export default Accounts;
