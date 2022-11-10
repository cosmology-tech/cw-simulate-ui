import React from "react";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/createTheme";
import T1Container from "../grid/T1Container";
import ReactDiffViewer from "@terran-one/react-diff-viewer";
import {
  ContractResponse,
  ExecuteTraceLog,
  ReplyTraceLog,
} from "@terran-one/cw-simulate/dist/types";
import { IRequest } from "../../atoms/simulationPageAtoms";
import T1JsonTree from "../T1JsonTree";

interface IProps {
  beforeState?: string;
  afterState?: string;
  response?:
    | JSON
    | undefined
    | IRequest
    | { ok: ContractResponse }
    | { error: any };
  isVisible?: boolean;
  placeholder: string;
  stepTrace?: ExecuteTraceLog | ReplyTraceLog | {};
}

export const OutputCard = ({
  beforeState,
  afterState,
  response,
  placeholder,
  isVisible,
  stepTrace,
}: IProps) => {
  const muiTheme = useTheme();

  return (
    <T1Container
      sx={{
        border: `1px solid ${muiTheme.palette.line}`,
        textAlign: "left",
        "> .T1Container-content": {
          pl: 1,
          pr: 1,
        },
      }}
    >
      {stepTrace ? (
        <T1JsonTree data={stepTrace} />
      ) : response !== undefined ? (
        <T1JsonTree data={response} />
      ) : isVisible ? (
        <ReactDiffViewer
          oldValue={beforeState}
          newValue={afterState}
          splitView={false}
        />
      ) : (
        <Typography variant="body2" color={muiTheme.palette.grey[50]}>
          {placeholder}
        </Typography>
      )}
    </T1Container>
  );
};
