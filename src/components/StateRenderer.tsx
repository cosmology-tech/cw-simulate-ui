import React from "react";
import { BeforeAfterState } from "./BeforeAfterState";
import StateMemoryTab from "./StateMemoryTab";
import { OutputCard } from "./OutputCard";
import { IState } from "./ExecuteQuery";
import { Grid } from "@mui/material";
import { OutputRenderer } from "./OutputRenderer";
import { useRecoilValue } from "recoil";
import { responseState } from "../atoms/responseState";

interface IProps {
  isFileUploaded: boolean;
  allStates: IState[];
  currentState: number;
}

export const StateRenderer = ({
  isFileUploaded,
  allStates,
  currentState,
}: IProps) => {
  const [currentTab, setCurrentTab] = React.useState("state");
  const [isChecked, setIsChecked] = React.useState(false);
  const response = useRecoilValue(responseState);
  const blockState = window.VM?.backend?.storage.dict["c3RhdGU="];
  const currentJSON =
    isFileUploaded && blockState !== undefined
      ? JSON.parse(window.atob(blockState))
      : undefined;
  const isStateTraversed =
    isFileUploaded &&
    allStates &&
    allStates.length - 1 > 0 &&
    allStates.length - 1 !== currentState;
  return (
    <Grid item xs={12} sx={{m: 2}}>
      <Grid item xs={12}>
        <StateMemoryTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          isStateTraversed={isStateTraversed}
        />
      </Grid>
      <Grid item xs={12}>
        {currentTab === "state" ? (
          isStateTraversed ? (
            <BeforeAfterState
              allStates={allStates}
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
          <OutputRenderer response={response}/>
        )}
      </Grid>
    </Grid>
  );
};
