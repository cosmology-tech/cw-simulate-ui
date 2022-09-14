import { Grid, TextField } from "@mui/material";
import SearchBar from "./SearchBar";
import TableLayout from "./TableLayout";

function createData(val1: any, val2: any) {
  return { val1, val2 };
}

const rows = [createData("Key1", "value1"), createData("Key2", "value2")];
const columnNames = ["Key", "Value"];
const State = () => {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Grid item xs={4}>
          <SearchBar />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <TableLayout rows={rows} columns={columnNames} />
      </Grid>
    </>
  );
};

export default State;
