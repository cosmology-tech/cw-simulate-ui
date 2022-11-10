import React from "react";
import StateResponseTab from "./StateResponseTab";
import { OutputCard } from "./OutputCard";
import { Grid } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import {
  stateResponseTabState,
  stepResponseState,
  stepRequestState,
  compareStates,
  stepTraceState,
  blockState,
} from "../../atoms/simulationPageAtoms";
import { StateTab } from "./StateTab";

interface IProps {
  isFileUploaded: boolean;
}

export const StateRenderer = ({ isFileUploaded }: IProps) => {
  const [currentTab, setCurrentTab] = useAtom(stateResponseTabState);
  const compareStateObj = useAtomValue(compareStates);
  const [isVisible, setIsVisible] = React.useState(false);
  const response = useAtomValue(stepResponseState);
  const request = useAtomValue(stepRequestState);
  const currentJSON = useAtomValue(blockState);
  const stepTrace = useAtomValue(stepTraceState);
  React.useEffect(() => {
    if (compareStateObj.state1 != "" && compareStateObj.state2 != "")
      setIsVisible(true);
  }, [compareStateObj]);

  return (
    <Grid container height="100%">
      <Grid
        item
        container
        direction="column"
        height="100%"
        width="50%"
        gap={2}
        flexWrap="nowrap"
      >
        <Grid item>
          <StateResponseTab
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </Grid>
        <Grid item flex={1}>
          {currentTab === "request" && (
            <OutputCard
              response={request}
              placeholder="Your request will appear here."
            />
          )}
          {currentTab === "trace" && (
            <OutputCard
              stepTrace={stepTrace}
              placeholder="Your trace will appear here."
            />
          )}
          {currentTab === "response" && (
            <OutputCard
              response={response}
              placeholder="Your response will appear here."
            />
          )}
          {currentTab === "debug" && (
            <OutputCard
              response={response}
              placeholder="Your debug messages will appear here."
            />
          )}
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        height="100%"
        width="50%"
        gap={2}
        flexWrap="nowrap"
      >
        <Grid item>
          <StateTab isVisible={isVisible} setIsVisible={setIsVisible} />
        </Grid>
        <Grid item flex={1}>
          {isVisible ? (
            <OutputCard
              beforeState={compareStateObj.state1}
              afterState={compareStateObj.state2}
              isVisible={isVisible}
              placeholder="Your state diff will appear here."
            />
          ) : (
            <OutputCard
              response={currentJSON}
              placeholder="Your state will appear here."
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
