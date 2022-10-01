import React from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { Grid, Typography } from "@mui/material";
import { GREY_6 } from "../configs/variables";
import { validateJSON } from "../utils/fileUtils";
import { useRecoilState } from "recoil";
import { jsonErrorState } from "../atoms/jsonErrorState";

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
  const [jsonError, setJsonError] = useRecoilState(jsonErrorState);
  return (
    <Grid
      item
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <Grid
        item
        sx={{
          overflow: "scroll",
          border: `1px solid ${GREY_6}`,
          height: "100%",
          width: "100%",
        }}
      >
        <ReactCodeMirror
          value={jsonValue}
          extensions={[json()]}
          onChange={(val: string) => {
            setPayload(val);
            if (val.length == 0) {
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
      </Grid>
      {jsonError && (
        <Grid item sx={{mt: 1}}>
          <Typography variant="subtitle2" color="red">
            Invalid JSON
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
