import React from "react";
import { useRecoilState } from "recoil";
import { executeQueryTabState } from "../atoms/executeQueryTabState";
import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";

const ExecuteQueryTab = () => {
  const [tabValue, setTabValue] = useRecoilState(executeQueryTabState);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <>
      <TabContext value={tabValue}>
        <Box sx={{border: "none"}}>
          <TabList onChange={handleChange} aria-label="Execute and Query tabs">
            <Tab label="Execute" value="execute"/>
            <Tab label="Query" value="query"/>
          </TabList>
        </Box>
      </TabContext>
    </>
  );
};

export default ExecuteQueryTab;
