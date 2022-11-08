import { json } from "@codemirror/lang-json";
import { Grid, Typography } from "@mui/material";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useAtom } from "jotai";
import React from "react";
import { jsonErrorState } from "../atoms/jsonErrorState";
import { useTheme } from "../configs/theme";
import { validateJSON } from "../utils/fileUtils";
import T1Container from "./grid/T1Container";

interface IJsonCodeMirrorEditorProps {
  jsonValue: string;
  placeholder?: any;
  setPayload: (val: string) => void;
}

export const JsonCodeMirrorEditor = ({
  jsonValue,
  placeholder,
  setPayload,
}: IJsonCodeMirrorEditorProps) => {
  const defaultPlaceholder = placeholder || {
    json: "Enter your json here",
  };
  const [jsonError, setJsonError] = useAtom(jsonErrorState);
  
  const theme = useTheme();

  return (
    <Grid
      container
      direction="column"
      height="100%"
      gap={1}
    >
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
              setPayload(val);
              if (val.length === 0) {
                setJsonError("");
                return;
              }
              try {
                const parsedJSON = JSON.parse(val);
                if (!validateJSON(parsedJSON, {})) {
                  //TODO: Show correct error message when validate message functionality changes.
                  setJsonError("Invalid JSON");
                } else {
                  setJsonError("");
                }
              } catch {
                setJsonError("Invalid JSON");
              }
            }}
            theme={theme.palette.mode}
            placeholder={JSON.stringify(defaultPlaceholder, null, 2)}
            style={{border: "none", height: "100%"}}
          />
        </T1Container>
      </Grid>
      {jsonError && (
        <Grid item>
          <Typography variant="body2" color="red">
            Invalid JSON
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
