import { atom } from "recoil";

export const snackbarNotificationAtom = atom({
  key: 'snackbarNotificationAtom',
  default: {
    open: false,
    message: '',
    severity: 'success',
    vertical: 'top',
    horizontal: 'center',
  },
});