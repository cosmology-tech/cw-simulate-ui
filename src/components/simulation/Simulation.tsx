import { Box, Divider, Grid, Paper, styled } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { ExecuteQuery } from "../ExecuteQuery";
import { responseState } from "../../atoms/responseState";
import { allStatesAtom } from "../../atoms/allStatesAtom";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { StateRenderer } from "../StateRenderer";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import StateStepper from "./StateStepper";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const Simulation = () => {
  const [response, setResponse] = useRecoilState(responseState);
  const [allStates, setAllStates] = useRecoilState(allStatesAtom);
  const [currentState, setCurrentState] = useRecoilState(currentStateNumber);
  const isFileUploaded = useRecoilValue(fileUploadedState);
  return (
    <Box sx={{ flexGrow: 1, height: "100%" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={4} sx={{ height: "100%" }}>
          <Item sx={{ height: "100%", overflow: "scroll" }}>
            <Grid item xs={12} sx={{ height: "100%", p: 1 }}>
              <StateStepper />
            </Grid>
          </Item>
        </Grid>
        <Grid item xs={8} sx={{ height: "100%" }}>
          <Item
            sx={{
              display: "flex",
              flexDirection: "column",
              pt: 0,
              pb: 0,
              height: "100%",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{ paddingLeft: "0px !important", m: 2, height: "50%" }}
            >
              <ExecuteQuery
                response={response}
                setResponse={setResponse}
                setAllStates={setAllStates}
                allStates={allStates}
                setCurrentState={setCurrentState}
                currentState={currentState}
              />
            </Grid>
            <Divider flexItem />
            <Grid
              item
              xs={12}
              sx={{
                paddingLeft: "0px !important",
                overflow: "scroll",
                m: 2,
              }}
            >
              <StateRenderer
                isFileUploaded={isFileUploaded}
                allStates={allStates}
                currentState={currentState}
              />
            </Grid>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Simulation;
