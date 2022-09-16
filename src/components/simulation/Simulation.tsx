import { Box, Divider, Grid, Paper, styled } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { ExecuteQuery } from "../ExecuteQuery";
import StateFlow from "../StateFlow";
import { responseState } from "../../atoms/responseState";
import { allStatesAtom } from "../../atoms/allStatesAtom";
import { currentStateNumber } from "../../atoms/currentStateNumber";
import { StateRenderer } from "../StateRenderer";
import { fileUploadedState } from "../../atoms/fileUploadedState";

const Item = styled(Paper)(({theme}) => ({
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
    <Box sx={{flexGrow: 1}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item sx={{height: "50vh"}}>
            <StateFlow/>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item
            sx={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              display: "flex",
              flexDirection: "row",
              pt: 0,
              pb: 0,
            }}
          >
            <Grid item xs={6} sx={{paddingLeft: "0px !important"}}>
              <ExecuteQuery
                response={response}
                setResponse={setResponse}
                setAllStates={setAllStates}
                allStates={allStates}
                setCurrentState={setCurrentState}
                currentState={currentState}
              />
            </Grid>
            <Divider orientation="vertical" flexItem/>
            <Grid item xs={6} sx={{paddingLeft: "0px !important"}}>
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
