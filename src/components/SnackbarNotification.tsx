import { Alert, Snackbar } from "@mui/material";
import { useRecoilState } from "recoil";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import { AlertColor } from "@mui/material/Alert/Alert";

const SnackbarNotification = () => {
  const [snackbarState, setSnackbarState] = useRecoilState(snackbarNotificationAtom);
  return (
    <Snackbar autoHideDuration={2000}
              onClose={() => setSnackbarState({...snackbarState, open: false})}
              open={snackbarState.open}
              anchorOrigin={{vertical: "top", horizontal: "center"}}
              key={snackbarState.vertical + snackbarState.horizontal}>
      <Alert severity={snackbarState.severity as AlertColor} sx={{width: "100%"}}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarNotification;
