import React from "react";
import { BeforeAfterState } from "./BeforeAfterState";
import StateMemoryTab from "./StateMemoryTab";
import { OutputCard } from "./OutputCard";
import { Grid } from "@mui/material";
import { OutputRenderer } from "./OutputRenderer";
import { responseState } from "../../atoms/responseState";
import { blockState } from "../../atoms/blockState";
import { useAtomValue } from "jotai";

interface IProps {
  isFileUploaded: boolean;
  currentState: number;
}

export const StateRenderer = ({ isFileUploaded, currentState }: IProps) => {
  const [currentTab, setCurrentTab] = React.useState("state");
  const [isChecked, setIsChecked] = React.useState(false);
  const response = useAtomValue(responseState);
  const currentJSON = useAtomValue(blockState);
  // TODO: Check current active state and executionHistory length.
  const isStateTraversed = false;
  return (
    <Grid item xs={12} sx={{ height: "100%" }}>
      <Grid item xs={12}>
        <StateMemoryTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          isStateTraversed={isStateTraversed}
        />
      </Grid>
      <Grid item xs={12} sx={{ height: "80%" }}>
        {currentTab === "state" ? (
          isStateTraversed ? (
            <BeforeAfterState
              currentState={currentState + 1}
              isChecked={isChecked}
            />
          ) : (
            <OutputCard
              response={currentJSON}
              placeholder="Your state will appear here."
            />
          )
        ) : (
          <OutputRenderer response={response} />
        )}
      </Grid>
    </Grid>
  );
};
