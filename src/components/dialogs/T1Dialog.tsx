import { cx } from '@emotion/css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ComponentType, ReactNode, useCallback, useMemo, useState } from 'react';
import type { StyleProps } from '../../utils/typeUtils';
import ConfirmDialog from './ConfirmDialog';

export type T1DialogProps = StyleProps & {
  children?: ReactNode;
  open?: boolean;
  confirmClose?: boolean;
  title?: string;
  actions?: ReactNode | ((api: T1DialogAPI) => ReactNode);
  ConfirmCloseDialogComponent?: ComponentType<{
    open: boolean;
    onConfirm(): void;
    onClose(): void;
  }>;
  onClose(): void;
}

export interface T1DialogAPI {
  /** Close the T1Dialog. If `success` is true, the action is considered successfully completed and the dialog is closed
   * immediately. Otherwise, if `confirmClose` property is true, asks for confirmation before closing.
   */
  close(success: boolean): void;
}

export default function T1Dialog({
  children,
  open,
  confirmClose,
  title,
  actions,
  ConfirmCloseDialogComponent = ConfirmDialog,
  onClose,
  sx,
  className,
}: T1DialogProps) {
  const [openConfirmClose, setOpenConfirmClose] = useState(false);
  
  const api = useMemo<T1DialogAPI>(() => ({
    close(success) {
      if (success || !confirmClose) {
        onClose();
      } else {
        setOpenConfirmClose(true);
      }
    },
  }), [confirmClose, onClose]);
  
  const handleConfirmClose = useCallback(() => {
    setOpenConfirmClose(false);
    onClose();
  }, [onClose]);
  
  return (
    <>
      <Dialog open={!!open} onClose={() => api.close(false)} sx={sx} className={cx('T1Dialog', className)}>
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
