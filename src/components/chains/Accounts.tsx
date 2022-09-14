import { Grid, Button, Typography } from "@mui/material";
import TableLayout from "./TableLayout";
function createData(val1: any, val2: any, val3: any) {
  return { val1, val2, val3 };
}

const rows = [
  createData("Testvalue1", "Testvalue2", "TestValue3"),
  createData("Testvalue4", "Testvalue5", "TestValue6"),
];
const columnNames = ["ID", "Account Address", "Balance"];
const Accounts = () => {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained">
            <Typography variant="button">New Account</Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <TableLayout rows={rows} columns={columnNames} />
      </Grid>
    </>
  );
};

export default Accounts;
