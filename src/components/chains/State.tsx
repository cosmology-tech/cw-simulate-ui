import { useRecoilValue } from "recoil";
import filteredStatesByChainId from "../../selectors/filteredStatesByChainId";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import TableLayout from "./TableLayout";
import { useMemo } from "react";

type Row = {
  contract: string;
  key: string;
  value: string;
}

const State = () => {
  const chainId = useParams().chainId!
  const states = useRecoilValue(filteredStatesByChainId(chainId as string));
  
  const data = useMemo(() => {
    const rows: Row[] = [];
    for (const address in states) {
      for (const key in states[address]) {
        rows.push({
          contract: address,
          key,
          value: states[address][key],
        });
      }
    }
    return rows;
  }, [states]);
  
  return (
    <>
      <Typography variant="h4">{chainId}</Typography>
      {data.length ? (
        <>
          <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
            <Grid item xs={4}>
              <SearchBar/>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{mt: 4}}>
            <TableLayout
              rows={data}
              columns={{
                contract: 'Contract Address',
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
