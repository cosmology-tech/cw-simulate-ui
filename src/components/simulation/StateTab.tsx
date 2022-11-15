import Box from "@mui/material/Box";
import ReactDiffViewer from "@terran-one/react-diff-viewer";
import { useAtomValue } from "jotai";
import React, {useEffect, useState} from "react";
import { blockState, compareStates } from "../../atoms/simulationPageAtoms";
import T1JsonTree from "../T1JsonTree";
import CloseDiff from "./CloseDiff";

export interface IStateTabProps {}

export const StateTab = ({}: IStateTabProps) => {
  const compareStateObj = useAtomValue(compareStates);
  const currentJSON = useAtomValue(blockState);
  const [isDiff, setIsDiff] = useState(false);

  useEffect(() => {
    setIsDiff(compareStateObj.state1 !== '' && compareStateObj.state2 !== '');
  }, [compareStateObj]);

  if (isDiff) {
    return (
      <Box>
        <CloseDiff onClick={() => {setIsDiff(false)}} />
        <ReactDiffViewer
          oldValue={compareStateObj.state1}
          newValue={compareStateObj.state2}
        />
      </Box>
    )
  }
  else {
    return (
      <T1JsonTree data={currentJSON ?? {}} />
    )
  }
}
