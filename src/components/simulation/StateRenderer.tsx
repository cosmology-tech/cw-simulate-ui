import React, {Component} from "react";
import StateResponseTab from "./StateResponseTab";
import {OutputCard} from "./OutputCard";
import {Grid} from "@mui/material";
import {stepResponseState} from "../../atoms/stepResponseState";
import {blockState} from "../../atoms/blockState";
import {useAtom, useAtomValue} from "jotai";
import {stateResponseTabState} from "../../atoms/stateResponseTabState";
import {compareStates} from "../../atoms/compareStates";
import {stepRequestState} from "../../atoms/stepRequestState";
import {stepTraceState} from "../../atoms/stepTraceState";
import {StateTab} from "./StateTab";
import {SummaryTab, ResponseTab, CallsTab, DebugTab} from "./InspectorTabs";
import T1Container from "../grid/T1Container";

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


  let renderedTab;

  switch(currentTab) {
    case "summary":
      renderedTab = <SummaryTab traceLog={stepTrace}/>;
      break;
    case "response":
      renderedTab = <ResponseTab traceLog={stepTrace}/>;
      break;
    case "calls":
      renderedTab = <CallsTab traceLog={stepTrace}/>;
      break;
    default:
      renderedTab = <DebugTab traceLog={stepTrace}/>;
  }

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
          <T1Container>{renderedTab}</T1Container>
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
