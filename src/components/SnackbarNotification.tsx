import { Alert, Snackbar } from "@mui/material";
import { useRecoilState } from "recoil";
import { snackbarNotificationState } from "../atoms/snackbarNotificationState";
import { AlertColor } from "@mui/material/Alert/Alert";

const SnackbarNotification = () => {
  const [snackbarState, setSnackbarState] = useRecoilState(snackbarNotificationState);
  return (
    <Snackbar autoHideDuration={2000}
              onClose={() => setSnackbarState({...snackbarState, open: false})}
              open={snackbarState.open}
              anchorOrigin={{vertical: snackbarState.vertical, horizontal: snackbarState.horizontal}}
              key={snackbarState.vertical + snackbarState.horizontal}
              transitionDuration={1000}>
      <Alert severity={snackbarState.severity as AlertColor} sx={{width: "100%"}}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarNotification;
