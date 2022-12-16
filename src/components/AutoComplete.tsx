import {
  Autocomplete,
  AutocompleteRenderInputParams,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import React from "react";

interface IAutoCompleteProps {
  callback?: (e: React.SyntheticEvent, val: string) => void;
  defaultValue?: string;
  options: any[];
  label?: string;
  sx?: SxProps<Theme>;
  textFieldStyle?: SxProps<Theme>;
  value?: string;
}
const AutoComplete = ({
  callback,
  defaultValue,
  options,
  label,
  sx,
  value,
  textFieldStyle,
}: IAutoCompleteProps) => {
  return (
    <Autocomplete
      onInputChange={callback}
      sx={sx}
      defaultValue={defaultValue}
      value={value}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={label} sx={textFieldStyle} />
      )}
      options={options}
    />
  );
};

export default AutoComplete;
