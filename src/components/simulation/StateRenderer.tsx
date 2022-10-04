import React from "react";
import { BeforeAfterState } from "./BeforeAfterState";
import StateResponseTab from "./StateResponseTab";
import { OutputCard } from "./OutputCard";
import { Grid } from "@mui/material";
import { OutputRenderer } from "./OutputRenderer";
import { responseState } from "../../atoms/responseState";
import { blockState } from "../../atoms/blockState";
import { useAtom, useAtomValue } from "jotai";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";

interface IProps {
  isFileUploaded: boolean;
}

export const StateRenderer = ({isFileUploaded}: IProps) => {
  const [currentTab, setCurrentTab] = useAtom(stateResponseTabState);
  const [isChecked, setIsChecked] = React.useState(false);
  const response = useAtomValue(responseState);
  const currentJSON = useAtomValue(blockState);
  // TODO: Check current active state and executionHistory length.
  const isStateTraversed = false;
  return (
    <Grid item xs={12} sx={{height: "100%"}}>
      <Grid item xs={12}>
        <StateResponseTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          isStateTraversed={isStateTraversed}
        />
      </Grid>
      <Grid item xs={12} sx={{height: "80%"}}>
        {currentTab === "state" ? (
          isStateTraversed ? (
            <BeforeAfterState isChecked={isChecked}/>
          ) : (
            <OutputCard
              response={currentJSON}
              placeholder="Your state will appear here."
            />
          )
        ) : (
          <OutputRenderer response={response}/>
        )}
      </Grid>
    </Grid>
  );
};
