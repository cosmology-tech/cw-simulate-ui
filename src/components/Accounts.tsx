import {
  Autocomplete,
  AutocompleteRenderInputParams,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { Coin } from "@terran-one/cw-simulate";
import React from "react";
import { useAccounts } from "../CWSimulationBridge";
import useSimulation from "../hooks/useSimulation";
import { joinSx } from "../utils/reactUtils";
import Address from "./chains/Address";

interface IAccounts {
  defaultAccount?: string;
  label?: string;
  sx?: SxProps<Theme>;
  onChange?(address: string, balance: Coin[]): void;
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
    <Autocomplete
      defaultValue={defaultAccount || Object.keys(accounts)[0]}
      options={Object.keys(accounts)}
      onInputChange={(_, value) => onChange?.(value, accounts[value])}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={label || "Sender"} />
      )}
      sx={joinSx(sx, { width: "100%" })}
    />
  );
};

export default Accounts;
