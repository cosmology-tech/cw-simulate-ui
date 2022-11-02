import React from "react";
import StateResponseTab from "./StateResponseTab";
import { OutputCard } from "./OutputCard";
import { Grid } from "@mui/material";
import { OutputRenderer } from "./OutputRenderer";
import { stepResponseState } from "../../atoms/stepResponseState";
import { blockState } from "../../atoms/blockState";
import { useAtom, useAtomValue } from "jotai";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";
import { compareStates } from "../../atoms/compareStates";
import { stepRequestState } from "../../atoms/stepRequestState";
import { stepTraceState } from "../../atoms/stepTraceState";

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
    <Grid
      item
      container
      direction="column"
      height="100%"
      gap={2}
      flexWrap="nowrap"
    >
      <Grid item>
        <StateResponseTab
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </Grid>
      <Grid item flex={1}>
        {currentTab === "state" &&
          (isVisible ? (
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
          ))}
        {currentTab === "request" && <OutputRenderer response={request} />}
        {currentTab === "trace" && (
          <OutputCard
            stepTrace={stepTrace}
            placeholder="Your trace will appear here."
          />
        )}
        {currentTab === "response" && <OutputRenderer response={response} />}
        {currentTab === "debug" && <OutputRenderer response={response} />}
      </Grid>
    </Grid>
  );
};
