import { cx } from '@emotion/css';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import { ComponentType, MouseEvent, ReactNode, useCallback, useState } from 'react';
import { StyleProps } from 'src/utils/typeUtils';

export type DialogButtonProps = StyleProps & {
  children?: ReactNode;
  Component?: ComponentType<{
    children?: ReactNode;
    onClick?(e: MouseEvent): void;
  }>;
  DialogComponent: ComponentType<{
    open?: boolean;
    onClose(): void;
  }>;
  onClick?(e: MouseEvent): void;
  onClose?(): void;
}

/** A specialized button for showing dialogs upon click. */
export default function DialogButton({
  children,
  Component = Button,
  DialogComponent,
  onClick,
  onClose,
  sx,
  className,
}: DialogButtonProps) {
  const [open, setOpen] = useState(false);
  
  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);
  
  const handleClick = useCallback((e: MouseEvent) => {
    setOpen(true);
    onClick?.(e);
  }, [onClick]);
  
  return (
    <>
      <Component
        onClick={handleClick}
        // ignore these two props, they're optional
        //@ts-ignore
        sx={sx}
        //@ts-ignore
        className={cx('T1DialogButton', className)}
      >
        {children}
      </Component>
      <Portal>
        <DialogComponent
          open={open}
          onClose={close}
        />
      </Portal>
    </>
  )
}
