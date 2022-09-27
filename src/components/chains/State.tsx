import { useRecoilValue } from "recoil";
import filteredStatesByChainId from "../../selectors/filteredStatesByChainId";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import TableLayout from "./TableLayout";

function createData(key: any, value: any) {
  return {key, value};
}

const State = () => {
  const param = useParams();
  const states = useRecoilValue(filteredStatesByChainId(param.id as string));
  const stateRows = states !== undefined ? Object.entries(states).map(([key, value]) => createData(key, value)) : undefined;
  return (
    <>
      {stateRows !== undefined ? (
        <>
          <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
            <Grid item xs={4}>
              <SearchBar/>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{mt: 4}}>
            <TableLayout
              rows={stateRows}
              columns={{
                key: 'Key',
                value: 'Value',
              }}
              keyField='key'
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={12} sx={{display: "flex", justifyContent: "center"}}>
          <Typography variant="h6">No States</Typography>
        </Grid>
      )}
    </>
  );
};

export default State;
