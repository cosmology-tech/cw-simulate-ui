import { ReactNode, useState } from "react";
import { Box, Popover, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";

export interface IPopoverProps {
  children?: ReactNode;
  text: string;
}

function T1Popover({children, text}: IPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // @ts-ignore
  const open = Boolean(anchorEl);

  return (
    <Box flexDirection='row'
         sx={{
           alignItems: 'center',
           display: 'flex',
           textAlign: 'center',
           justifyContent: 'center'
         }}>
      {children}
      <Info
        sx={{fontSize: '1.2rem', ml: 0.5, pb: 0.2}}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}/>
      <Popover
        id="mouse-over-popover"
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
  )
}

export default T1Popover;
