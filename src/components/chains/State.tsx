import { Grid } from "@mui/material";
import SearchBar from "./SearchBar";
import TableLayout from "./TableLayout";
import { useRecoilValue } from "recoil";
import filteredStatesFromSimulationState from "../../selectors/filteredStatesFromSimulationState";
import { useParams } from "react-router-dom";

function createData(val1: any, val2: any) {
  return {val1, val2};
}

const columnNames = ["Key", "Value"];
const State = () => {
  const param = useParams();
  const states = useRecoilValue(filteredStatesFromSimulationState(param.id as string)).states;
  const stateRows = Object.entries(states).map(([key, value]) => createData(key, value));
  return (
    <>
      <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
        <Grid item xs={4}>
          <SearchBar/>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{mt: 4}}>
        <TableLayout rows={stateRows} columns={columnNames}/>
      </Grid>
    </>
  );
};

export default State;
