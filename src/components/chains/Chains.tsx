import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography
} from "@mui/material";
import { useRecoilState } from "recoil";
import { chainsState } from "../../atoms/chainsState";
import { GREY_3 } from "../../configs/variables";
import React, { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { snackbarNotificationAtom } from "../../atoms/snackbarNotificationAtom";
import { ChainConfig } from "../../utils/setupSimulation";

const Chains = () => {
  const [chains, setChains] = useRecoilState(chainsState);
  const [openDialog, setOpenDialog] = useState(false);
  const [chainConfig, setChainConfig] = useState<ChainConfig>({} as ChainConfig);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationAtom
  );

  const sampleConfigJSON = `{
    "chainId": 'phoenix-1',
    "bech32Prefix": 'terra'
  }`;

  const handleClickOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleAddChain = () => {
    console.log(chainConfig);
    setSnackbarNotification({
      ...snackbarNotification,
      severity: "success",
      open: true,
      message: "Successfully added new chain config.",
    });
    setOpenDialog(false);
  }

  const handleChainConfigChange = (val: string) => {
    try {
      const newChainConfig = JSON.parse(val) as ChainConfig;
      setChainConfig(newChainConfig);
    } catch (e) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: "error",
        open: true,
        message: "Invalid JSON. Please check your input.",
      });
    }
  }

  return (
    <Grid sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      placeItems: "center",
      padding: "10px",
    }} container>
      <Typography variant="h4" sx={{flexGrow: 1}}>
        Chains
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Chain
      </Button>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Chain</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the chain configuration below.
          </DialogContentText>
          <ReactCodeMirror
            extensions={[json()]}
            onChange={(val: string) => handleChainConfigChange(val)}
            value={sampleConfigJSON}
            minHeight={"200px"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddChain}>Add</Button>
        </DialogActions>
      </Dialog>
      {chains.length > 0 ? (chains.map((chain) => (
          <Grid item xs={12} sx={{marginTop: 4, marginBottom: 4, width: "60%"}}>
            <p>test</p>
          </Grid>))) :
        (<Grid item xs={12} sx={{
          display: 'grid',
          marginTop: 4,
          marginBottom: 4,
          width: "60%",
          border: `1px solid ${GREY_3}`,
          borderRadius: "10px",
          height: "50vh",
          alignItems: "center",
        }}>
          <Typography variant="h6" sx={{textAlign: "center"}}>
            No chain configuration found. Please add a chain configuration.
          </Typography>
        </Grid>)}
    </Grid>
  )
}

export default Chains;
