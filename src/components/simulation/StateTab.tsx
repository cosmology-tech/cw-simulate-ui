import { Grid, Tabs, Tab } from "@mui/material";
import React, {useState} from "react";
import CloseDiff from "./CloseDiff";

interface IProps {
  setIsVisible: (val: boolean) => void;
  isVisible: boolean;
}

export const StateTab = ({ isVisible, setIsVisible }: IProps) => {

  const [currState, setCurrState] = useState('state');
  const onChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    setCurrState(
      (newValue === "state") ? "state" : "query"
    )
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Tabs value={currState} onChange={onChangeHandler} aria-label="State Tab">
          <Tab value="state" label="State" />
          <Tab value={"query"} label={"Query"} />
        </Tabs>
      </Grid>
      {isVisible && (
        <Grid item>
          <CloseDiff isVisible={isVisible} setIsVisible={setIsVisible} />
        </Grid>
      )}
    </Grid>
  );
};
