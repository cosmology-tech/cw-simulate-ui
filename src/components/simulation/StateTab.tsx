import Box from "@mui/material/Box";
import { useAtomValue } from "jotai";
import React, {useEffect, useState} from "react";
import { blockState, compareStates } from "../../atoms/simulationPageAtoms";
import CloseDiff from "./CloseDiff";
import { OutputCard } from "./OutputCard";

interface IProps {}

export const StateTab = ({}: IProps) => {
  const compareStateObj = useAtomValue(compareStates);
  const currentJSON = useAtomValue(blockState);
  const [isDiff, setIsDiff] = useState(false);

  useEffect(() => {
    if (compareStateObj.state1 !== '' && compareStateObj.state2 !== '')
      setIsDiff(true);
  }, [compareStateObj]);

  if (isDiff) {
    return (
      <Box>
        <CloseDiff onClick={() => {setIsDiff(false)}} />
        <OutputCard
          beforeState={compareStateObj.state1}
          afterState={compareStateObj.state2}
          isVisible
          placeholder="Your state diff will appear here."
        />
      </Box>
    )
  }
  else {
    return (
      <OutputCard
        response={currentJSON}
        placeholder="Your state will appear here."
      />
    )
  }
};
