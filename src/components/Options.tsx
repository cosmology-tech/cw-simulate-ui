import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { PopoverOrigin, PopoverPosition } from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { ReactNode, useCallback, useRef } from "react";

export interface IOptionsProps {
  children?: ReactNode;
  anchorOrigin?: PopoverOrigin;
  anchorPosition?: PopoverPosition;
  transformOrigin?: PopoverOrigin;
  open: boolean;
  onOpen(): void;
  onClose(): void;
  extras?: ReactNode;
}

/** An options menu hidden behind a kebab menu icon button. */
export default function Options({
  children,
  open,
  extras,
  onOpen,
  onClose,
  ...props
}: IOptionsProps)
{
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const toggle = useCallback(() => {open ? onClose() : onOpen()}, [open]);
  
  return (
    <>
      <IconButton ref={buttonRef} onClick={toggle}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={open}
        onClose={onClose}
        anchorEl={buttonRef.current}
        {...props}
      >
        {children}
      </Menu>
      {extras}
    </>
  );
}
