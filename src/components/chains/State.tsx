import { Grid } from "@mui/material";
import SearchBar from "./SearchBar";
import TableLayout from "./TableLayout";
import { useRecoilValue } from "recoil";
import filteredStatesFromSimulationState from "../../selectors/filteredStatesFromSimulationState";
import { useParams } from "react-router-dom";

function createData(val1: any, val2: any) {
  return {val1, val2};
}

const rows = [createData("Key1", "value1"), createData("Key2", "value2")];
const columnNames = ["Key", "Value"];
const State = () => {
  const param = useParams();
  const states = useRecoilValue(filteredStatesFromSimulationState).filter((state: any) => state.chainId === param.id)[0].states;
  console.log(states);
  return (
    <>
      <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
        <Grid item xs={4}>
          <SearchBar/>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{mt: 4}}>
        <TableLayout rows={[states]} columns={columnNames}/>
      </Grid>
    </>
  );
};

export default State;
