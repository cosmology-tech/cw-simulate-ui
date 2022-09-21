import { atom, useSetRecoilState } from "recoil";
import type { AlertProps } from "@mui/material/Alert";
import type { SnackbarProps } from "@mui/material/Snackbar";
import type { Defined } from "../utils/typeUtils";
import { useCallback } from "react";

interface SnackbarNotificationState {
  severity: Severity;
  open: boolean;
  message: string;
  vertical: Defined<SnackbarProps['anchorOrigin']>['vertical'];
  horizontal: Defined<SnackbarProps['anchorOrigin']>['horizontal'];
}

export type Severity = Defined<AlertProps['severity']>;

export type SnackbarNotificationOptions = Partial<Pick<SnackbarNotificationState, "severity" | "vertical" | "horizontal">>;

export const snackbarNotificationState = atom<SnackbarNotificationState>({
  key: 'snackbarNotificationState',
  default: {
    open: false,
    message: '',
    severity: 'success',
    vertical: 'top',
    horizontal: 'center',
  },
});

export const useNotification = () => {
  const setNotification = useSetRecoilState(snackbarNotificationState);
  const fn = useCallback((message: string, options: SnackbarNotificationOptions = {}) => {
    setNotification(() => ({
      horizontal: 'center',
      vertical: 'top',
      severity: 'success',
      ...options,
      message,
      open: true,
    }));
  }, []);
  return fn;
};

export const showNotification = (setNotification: any, message = "", severity: Severity = 'success') => {
  setNotification({
    open: true,
    message,
    severity,
    vertical: 'top',
    horizontal: 'center',
  });
};
