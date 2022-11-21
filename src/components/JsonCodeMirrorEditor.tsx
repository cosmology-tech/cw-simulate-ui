import { json } from "@codemirror/lang-json";
import { Grid, Typography } from "@mui/material";
import ReactCodeMirror from "@uiw/react-codemirror";
import React, { useState } from "react";
import { useTheme } from "../configs/theme";
import { validateJSON } from "../utils/fileUtils";
import T1Container from "./grid/T1Container";

interface IJsonCodeMirrorEditorProps {
  jsonValue: string;
  placeholder?: any;

  onChange?(val: string): void;

  onValidate?(valid: boolean): void;
}

export const JsonCodeMirrorEditor = ({
  jsonValue,
  placeholder,
  onChange,
  onValidate,
}: IJsonCodeMirrorEditorProps) => {
  const defaultPlaceholder = placeholder || {
    JSON: "Enter your JSON here",
  };

  const [validationError, setValidationError] = useState("");
  const theme = useTheme();

  return (
    <Grid container direction="column" height="100%" gap={1}>
      <Grid
        item
        flex={1}
        position="relative"
        border={`1px solid ${theme.palette.line}`}
      >
        <T1Container>
          <ReactCodeMirror
            value={jsonValue}
            extensions={[json()]}
            onChange={(val: string) => {
              onChange?.(val);
              if (val.length === 0) {
                onValidate?.(true);
                return;
              }
              try {
                const parsedJSON = JSON.parse(val);
                if (!validateJSON(parsedJSON, {})) {
                  //TODO: Show correct error message when validate message functionality changes.
                  setValidationError("Invalid JSON");
                  onValidate?.(false);
                } else {
                  onValidate?.(true);
                  setValidationError("");
                }
              } catch {
                setValidationError("Invalid JSON");
                onValidate?.(false);
              }
            }}
            theme={theme.palette.mode}
            placeholder={JSON.stringify(defaultPlaceholder, null, 2)}
            style={{ border: "none", height: "100%" }}
          />
        </T1Container>
      </Grid>
      {validationError && (
        <Grid item>
          <Typography variant="body2" color="red">
            {validationError}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
