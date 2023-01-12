import { cx } from '@emotion/css';
import Button, { ButtonProps } from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import { ComponentType, MouseEvent, ReactNode, useCallback, useState } from 'react';
import { StyleProps } from 'src/utils/typeUtils';

interface ComponentPropsMin {
  children?: ReactNode;
  onClick?(e: MouseEvent): void;
}

export type DialogButtonProps<P extends ComponentPropsMin> = StyleProps & {
  children?: ReactNode;
  Component?: ComponentType<P>;
  DialogComponent: ComponentType<{
    open?: boolean;
    onClose(): void;
  }>;
  ComponentProps?: Partial<Omit<P, 'open' | 'onClose'>>;
  onClick?(e: MouseEvent): void;
  onClose?(): void;
}

/** A specialized button for showing dialogs upon click. */
export default function DialogButton<P extends ComponentPropsMin = ButtonProps>({
  children,
  DialogComponent,
  ComponentProps,
  onClick,
  onClose,
  sx,
  className,
  ...remain
}: DialogButtonProps<P>) {
  const Component: any = remain.Component ?? Button;
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
        {...ComponentProps}
        onClick={handleClick}
        sx={sx}
        className={cx('T1DialogButton', className)}
      >
        {children}
      </Component>
      <Portal>
        <div aria-hidden onKeyDown={e => {e.stopPropagation()}} onKeyUp={e => {e.stopPropagation()}}>
          <DialogComponent
            open={open}
            onClose={close}
          />
        </div>
      </Portal>
    </>
  )
}
