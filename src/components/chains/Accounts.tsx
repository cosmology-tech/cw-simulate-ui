import { Button, Grid, Typography } from "@mui/material";
import TableLayout from "./TableLayout";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import filteredAccountsFromSimulationState
  from "../../selectors/filteredAccountsFromSimulationState";

const columnNames = ["ID", "Account Address", "Balance"];
const Accounts = () => {
  const param = useParams();
  const accounts = useRecoilValue(filteredAccountsFromSimulationState).filter((account: any) => account.chainId === param.id)[0].accounts;
  console.log(accounts);
  return (
    <>
      <Grid item xs={12} sx={{display: "flex", justifyContent: "end"}}>
        <Grid item xs={4} sx={{display: "flex", justifyContent: "end"}}>
          <Button variant="contained">
            <Typography variant="button">New Account</Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{mt: 4}}>
        <TableLayout rows={accounts} columns={columnNames}/>
      </Grid>
    </>
  );
};

export default Accounts;
