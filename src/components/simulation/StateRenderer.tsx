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

interface IProps {
  isFileUploaded: boolean;
}

export const StateRenderer = ({ isFileUploaded }: IProps) => {
  const [currentTab, setCurrentTab] = useAtom(stateResponseTabState);
  const compareStateObj = useAtomValue(compareStates);
  const [isChecked, setIsChecked] = React.useState(false);
  const response = useAtomValue(stepResponseState);
  const request = useAtomValue(stepRequestState);
  const currentJSON = useAtomValue(blockState);
  console.log(compareStateObj);
  React.useEffect(() => {
    if (compareStateObj.state1 != "" && compareStateObj.state2 != "")
      setIsChecked(true);
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
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
      </Grid>
      <Grid item flex={1}>
        {currentTab === "state" ? (
          isChecked ? (
            <OutputCard
              beforeState={compareStateObj.state1}
              afterState={compareStateObj.state2}
              isChecked={isChecked}
              placeholder="Your state diff will appear here."
            />
          ) : (
            <OutputCard
              response={currentJSON}
              placeholder="Your state will appear here."
            />
          )
        ) : currentTab === "request" ? (
          <OutputRenderer response={request} />
        ) : (
          <OutputRenderer response={response} />
        )}
      </Grid>
    </Grid>
  );
};
