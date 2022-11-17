import styled from "@mui/material/styles/styled";
import { Grid } from "@mui/material";
import { useAtomValue } from "jotai";
import React, { PropsWithChildren } from "react";
import { isDiffOpenState, stepTraceState } from "../../atoms/simulationPageAtoms";
import T1Container from "../grid/T1Container";
import { T1Tab, T1Tabs } from "../T1Tabs";
import LogsTab from "./tabs/LogsTab";
import ResponseTab from "./tabs/ResponseTab";
import SummaryTab from "./tabs/SummaryTab";
import { StateTab } from "./tabs/StateTab";
import QueryTab from "./tabs/QueryTab";
import CloseDiff from "./CloseDiff";

interface IProps {
  contractAddress: string;
}

export const StateRenderer = ({ contractAddress }: IProps) => {
  const stepTrace = useAtomValue(stepTraceState);
  const isDiffOpen = useAtomValue(isDiffOpenState);

  return (
    <Grid container height="100%" gap={1}>
      <Half>
        <T1Tabs ContentContainer={Content}>
          <T1Tab label="Summary">
            <SummaryTab traceLog={stepTrace} />
          </T1Tab>
          <T1Tab label="Response">
            <ResponseTab traceLog={stepTrace} />
          </T1Tab>
          <T1Tab label="Logs">
            <LogsTab traceLog={stepTrace} />
          </T1Tab>
        </T1Tabs>
      </Half>
      <Half>
        <T1Tabs
          ContentContainer={Content}
          right={isDiffOpen && <CloseDiff />}
        >
          <T1Tab label="State">
            <StateTab />
          </T1Tab>
          <T1Tab label="Query">
            <QueryTab contractAddress={contractAddress} />
          </T1Tab>
        </T1Tabs>
      </Half>
    </Grid>
  );
};

function Half({ children }: PropsWithChildren) {
  return (
    <Grid
      item
      container
      direction="column"
      height="100%"
      flex={1}
      gap={2}
      flexWrap="nowrap"
    >
      {children}
    </Grid>
  );
}

const Content = styled(T1Container)(({ theme }) => ({
  border: `1px solid ${theme.palette.line}`,
  "> .T1Container-content": {
    padding: theme.spacing(1),
  },
}));
