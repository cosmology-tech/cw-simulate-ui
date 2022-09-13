import { Grid, TextField } from "@mui/material";
import SearchBar from "./SearchBar";
import StateTable from "./StateTable";

const State = () => {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Grid item xs={4}>
          <SearchBar />
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <StateTable />
      </Grid>
    </>
  );
};

export default State;
