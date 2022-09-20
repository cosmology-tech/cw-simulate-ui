import { atom } from "recoil";

export type SEVERITY = 'success' | 'info' | 'warning' | 'error';
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

export const showNotification = (setNotification: any, message: string = "", severity: SEVERITY = 'success') => {
  setNotification({
    open: true,
    message,
    severity,
    vertical: 'top',
    horizontal: 'center',
  });
};
