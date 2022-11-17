import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReactDiffViewer from "@terran-one/react-diff-viewer";
import { useAtomValue } from "jotai";
import React from "react";
import {
  blockState,
  compareStringsState,
  isDiffOpenState,
} from "../../../atoms/simulationPageAtoms";
import T1JsonTree from "../../T1JsonTree";

export interface IStateTabProps {}

export const StateTab = ({}: IStateTabProps) => {
  const isDiff = useAtomValue(isDiffOpenState);
  const [state1, state2] = useAtomValue(compareStringsState);
  const currentJSON = useAtomValue(blockState);

  if (isDiff) {
    if (state1 === state2) {
      return (
        <Typography
          variant="body2"
          fontStyle="italic"
          color="GrayText"
          textAlign="center"
        >
          No difference between selected states.
        </Typography>
      );
    } else {
      return (
        <Box>
          <ReactDiffViewer
            oldValue={JSON.stringify(state1)}
            newValue={JSON.stringify(state2)}
            splitView={false}
          />
        </Box>
      );
    }
  } else {
    return <T1JsonTree data={currentJSON ?? {}} />;
  }
};
