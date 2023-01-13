import { cx } from '@emotion/css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { ComponentType, ReactNode, useCallback, useMemo, useState } from 'react';
import type { StyleProps } from '../../utils/typeUtils';
import ConfirmDialog from './ConfirmDialog';

export type T1DialogProps<R = void> = StyleProps & {
  children?: ReactNode;
  open?: boolean;
  confirmClose?: boolean;
  title?: string;
  actions?: ReactNode | ((api: T1DialogAPI<R>) => ReactNode);
  ConfirmCloseDialogComponent?: ComponentType<{
    open: boolean;
    onConfirm(): void;
    onClose(): void;
  }>;
  onClose(result?: R): void;
  /** Called when the dialog is finished successfully. */
  onFinish?(result: R): void;
  onCancel?(): void;
}

export interface T1DialogAPI<R = void> {
  finish: R extends void ? (() => void) : ((result: R) => void);
  cancel(): void;
}

export default function T1Dialog<R = void>({
  children,
  open,
  confirmClose,
  title,
  actions,
  ConfirmCloseDialogComponent = ConfirmDialog,
  onClose,
  onCancel,
  onFinish,
  sx,
  className,
}: T1DialogProps<R>) {
  const [openConfirmClose, setOpenConfirmClose] = useState(false);
  
  const api = useMemo<T1DialogAPI<R>>(() => ({
    cancel() {
      if (confirmClose) {
        setOpenConfirmClose(true);
      } else {
        onCancel?.();
        onClose(undefined);
      }
    },
    //@ts-ignore
    finish(value) {
      onFinish?.(value);
      onClose(value);
    },
  }), [confirmClose, onClose]);
  
  const handleConfirmClose = useCallback(() => {
    setOpenConfirmClose(false);
    onCancel?.();
    onClose(undefined);
  }, [onClose]);
  
  return (
    <>
      <Dialog open={!!open} onClose={() => api.cancel()} sx={sx} className={cx('T1Dialog', className)}>
        <DialogTitle>{title}</DialogTitle>
        {children}
        <DialogActions>
          {typeof actions === 'function' ? actions(api) : actions}
        </DialogActions>
      </Dialog>
      <ConfirmCloseDialogComponent
        open={openConfirmClose}
        onConfirm={handleConfirmClose}
        onClose={() => {setOpenConfirmClose(false)}}
      />
    </>
  )
}
