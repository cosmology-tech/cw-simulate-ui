import { atom } from "recoil";

export const snackbarNotificationState = atom({
  key: 'snackbarNotificationState',
  default: {
    open: false,
    message: '',
    severity: 'success',
    vertical: 'top',
    horizontal: 'center',
  },
});
