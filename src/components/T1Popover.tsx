import { ReactNode, useId, useState } from "react";
import { Box, Popover, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import MouseAwayListener from "./MouseAwayListener";

export interface IPopoverProps {
  children?: ReactNode;
  text: ReactNode;
}

function T1Popover({children, text}: IPopoverProps) {
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
          }}>
        {children}
        <Info
          ref={setAnchorEl}
          sx={{fontSize: '1.2rem', ml: 0.5, pb: 0.2}}
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
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{p: 1}}>{text}</Typography>
        </Popover>
      </Box>
    </MouseAwayListener>
  )
}

export default T1Popover;
