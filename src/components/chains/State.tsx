import filteredStatesByChainId from "../../selectors/filteredStatesByChainId";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import SearchBar from "./SearchBar";
import TableLayout from "./TableLayout";
import { useMemo } from "react";
import { useAtomValue } from "jotai";
import T1Container from "../grid/T1Container";

type Row = {
  contract: string;
  key: string;
  value: string;
}

const State = () => {
  const chainId = useParams().chainId!
  const states = useAtomValue(filteredStatesByChainId(chainId as string));

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
  
  const title = (
    <>
      <Typography variant="h4">{chainId}</Typography>
      <Typography variant="h6">States</Typography>
    </>
  );

  if (data.length) {
    return (
      <>
        <Grid item container sx={{mb: 2}}>
          <Grid item flex={1}>
            {title}
          </Grid>
          <Grid item xs={4}>
            <SearchBar/>
          </Grid>
        </Grid>
        <Grid item flex={1}>
          <T1Container>
            <TableLayout
              rows={data}
              columns={{
                contract: 'Contract Address',
                key: 'Key',
                value: 'Value',
              }}
              keyField="key"
            />
          </T1Container>
        </Grid>
      </>
    );
  }
  else {
    return (
      <>
        {title}
        <Grid item container justifyContent="center" sx={{mt: 6, mb: 6}}>
          <Typography variant="h6">No States</Typography>
        </Grid>
      </>
    );
  }
};

export default State;
