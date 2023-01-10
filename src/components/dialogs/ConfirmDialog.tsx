import { cx } from '@emotion/css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { ReactNode } from 'react';
import { StyleProps } from '../../utils/typeUtils'

export type ConfirmDialogProps = StyleProps & {
  children?: ReactNode;
  title?: string;
  message?: string;
  open?: boolean;
  onConfirm?(): void;
  onCancel?(): void;
  onClose?(): void;
}

export default function ConfirmDialog({
  children,
  open = false,
  title = 'Please confirm',
  message = 'Are you certain you want to continue? This has potentially unstable, dangerous, or irrecoverable implications.',
  onConfirm,
  onCancel,
  onClose,
  sx,
  className,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      sx={sx}
      className={cx('T1ConfirmDialog', className)}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {children ?? (
          <DialogContentText>{message}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onCancel?.();
            onClose?.();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export type ConfirmDeleteDialogProps = ConfirmDialogProps & {
  noun?: string;
}

/** A `ConfirmDialog` with different defaults suitable for deletion confirmation dialogs. */
export function ConfirmDeleteDialog({ noun, ...props }: ConfirmDeleteDialogProps) {
  return (
    <ConfirmDialog
      {...props}
      title='Confirm Deletion'
      message={`Are you sure you want to delete this${noun ? ` ${noun}` : ''}?`}
    />
  )
}
