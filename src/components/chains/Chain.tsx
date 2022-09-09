import { Box } from "@mui/material";
import Config from "./Config";
import Codes from "./Codes";
import Accounts from "./Accounts";
import State from "./State";
import Instances from "./Instances";

const Chain = () => {
  return (
    <Box sx={{display: "flex"}}>
      <Config/>
      <State/>
      <Accounts/>
      <Codes/>
      <Instances/>
    </Box>
  )
}

export default Chain;
