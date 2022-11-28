import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import Popover, { PopoverProps } from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { ReactNode, useId, useState } from "react";
import MouseAwayListener from "./MouseAwayListener";

export interface IT1InfoProps {
  children?: ReactNode;
  text: ReactNode;
  anchorOrigin?: PopoverProps['anchorOrigin'];
  transformOrigin?: PopoverProps['transformOrigin'];
  iconSize?: SvgIconProps['fontSize'];
  className?: string;
}

export default function T1Info({
  children,
  text,
  anchorOrigin = {
    vertical: "center",
    horizontal: "right",
  },
  transformOrigin = {
    vertical: "center",
    horizontal: "left",
  },
  iconSize = "small",
  className,
}: IT1InfoProps)
{
  const id = useId();
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const [open, setOpen] = useState(false);
  
  const handlePopoverOpen = () => {
    setOpen(true);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  return (
    <MouseAwayListener onMouseAway={handlePopoverClose}>
      <Box flexDirection='row'
        sx={{
          alignItems: 'center',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center'
        }}
        className={`T1Info-root ${className}`}
      >
        {children}
        <InfoIcon
          ref={setAnchorEl}
          fontSize={iconSize}
          sx={{ ml: 0.5 }}
          aria-owns={open ? id : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
        />
        <Popover
          id={id}
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{p: 1}}>{text}</Typography>
        </Popover>
      </Box>
    </MouseAwayListener>
  )
}
