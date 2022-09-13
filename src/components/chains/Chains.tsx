import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useRecoilState } from "recoil";
import React, { useRef, useState } from "react";
import { snackbarNotificationState } from "../../atoms/snackbarNotificationState";
import { Outlet, useParams } from "react-router-dom";
import { ScreenSearchDesktopOutlined } from "@mui/icons-material";
import T1Grid from "../T1Grid";

const Chains = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [chainNamesTextField, setChainNamesTextField] = useState<string[]>([]);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const param = useParams();
  const textFieldRef = useRef<any>(null);

  const handleClickOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleAddChain = () => {
    const newChainNames = textFieldRef.current.value.split(",").map((el: string) => el.trim());
    const prevChainNames = new Set(chainNamesTextField);
    if (newChainNames.length === 1) {
      setChainNamesTextField([...prevChainNames.add(newChainNames[0])]);
    } else {
      setChainNamesTextField(Array.from(new Set([...prevChainNames, ...newChainNames])));
    }

    setSnackbarNotification({
      ...snackbarNotification,
      severity: "success",
      open: true,
      message: 'Successfully added new chains.',
    });
    setOpenDialog(false);
  }

  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        marginTop: 4,
        marginBottom: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {param.id === undefined ? (<Grid sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          placeItems: "center",
          padding: "10px",
        }} container xs={11} md={11} lg={10}>
          <Typography variant="h5" sx={{flexGrow: 1}}>
            Chains
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Chain
          </Button>
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Add New Chains</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter chain names separated by commas. i.e. phoenix-1, osmosis-1, terra-1
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Chain name"
                type="text"
                fullWidth
                variant="standard"
                inputRef={textFieldRef}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleAddChain}>Add</Button>
            </DialogActions>
          </Dialog>
          {!openDialog && chainNamesTextField.length > 0 ?
            (<T1Grid items={[...new Set(chainNamesTextField)]} hasRightDeleteButton={true}/>)
            : (<Grid item xs={12} sx={{
              display: 'grid',
              marginTop: 4,
              marginBottom: 4,
              width: "60%",
              borderRadius: "5px",
              height: "50vh",
              alignItems: "center",
            }}>
              <Stack sx={{textAlign: 'center', alignItems: 'center'}}>
                <ScreenSearchDesktopOutlined sx={{fontSize: "100px"}}/>
                <Typography variant="h6">
                  No chain found. Please add a chain.
                </Typography>
              </Stack>
            </Grid>)}
        </Grid>)
        : <Outlet/>
      }
    </Box>
  );
}

export default Chains;
