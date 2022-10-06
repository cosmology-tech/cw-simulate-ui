import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Box, Grid, Typography } from "@mui/material";
import { GREY_6 } from "../configs/variables";
import { validateJSON } from "../utils/fileUtils";
import { jsonErrorState } from "../atoms/jsonErrorState";
import { useAtom } from "jotai";

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
        border={`1px solid ${GREY_6}`}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
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
            placeholder={JSON.stringify(defaultPlaceholder, null, 2)}
            style={{border: "none", height: "100%"}}
          />
        </Box>
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
