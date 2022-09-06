import React from "react";
import { useRecoilState } from "recoil";
import { executeQueryTabAtom } from "../atoms/executeQueryTabAtom";
import { TabContext, TabList } from "@mui/lab";
import { Box, Tab } from "@mui/material";

const ExecuteQueryTab = () => {
  const [tabValue, setTabValue] = useRecoilState(executeQueryTabAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div style={{display: "flex", marginLeft: 10}}>
      <TabContext value={tabValue}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <TabList onChange={handleChange} aria-label="Execute and Query tabs">
            <Tab label="Execute" value="execute"/>
            <Tab label="Query" value="query"/>
          </TabList>
        </Box>
      </TabContext>
    </div>
  );
};

export default ExecuteQueryTab;
