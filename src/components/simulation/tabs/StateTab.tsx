import Box from "@mui/material/Box";
import ReactDiffViewer from "@terran-one/react-diff-viewer";
import { useAtomValue } from "jotai";
import React from "react";
import { compareDeep } from "../../../CWSimulationBridge";
import {
  blockState,
  compareStringsState,
  isDiffOpenState,
} from "../../../atoms/simulationPageAtoms";
import T1JsonTree from "../../T1JsonTree";
import { EmptyTab } from "./Common";
import { darkModeState } from "../../../atoms/uiState";
import CopyToClipBoard from "../CopyToClipBoard";

export interface IStateTabProps {}

export const StateTab = ({}: IStateTabProps) => {
  const isDiff = useAtomValue(isDiffOpenState);
  const [state1, state2] = useAtomValue(compareStringsState);
  const currentJSON = useAtomValue(blockState);
  const darkModeEnabled = useAtomValue(darkModeState);
  if (isDiff) {
    if (compareDeep(state1, state2)) {
      return <EmptyTab>No difference between selected states.</EmptyTab>;
    }
    return (
      <Box>
        <ReactDiffViewer
          oldValue={JSON.stringify(state1)}
          newValue={JSON.stringify(state2)}
          splitView={false}
          useDarkTheme={darkModeEnabled}
        />
      </Box>
    );
  } else {
    if (!currentJSON) return <EmptyTab />;
    return (
      <T1JsonTree
        data={currentJSON}
        right={
          <CopyToClipBoard
            data={JSON.stringify(currentJSON)}
            title="Copy State Response"
          />
        }
      />
    );
  }
};
