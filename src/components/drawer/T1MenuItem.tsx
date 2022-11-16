import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material";
import { MouseEvent, ReactNode, useCallback, useMemo, useState } from "react";
import Options from "../Options";
import { To, useNavigate } from "react-router-dom";

export interface IT1MenuItemProps {
  children?: ReactNode;
  label: NonNullable<ReactNode>;
  link?: To | string;
  /** If true, overflowing label text will be hidden behind ellipsis. */
  textEllipsis?: boolean;
  options?: Options;
  /** Additional menus or popovers for `options` items. */
  optionsExtras?: Options;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
  menuRef?: React.Ref<HTMLUListElement>;
  tooltip?: ILabelProps['tooltip'];
  tooltipProps?: ILabelProps['tooltipProps'];
  onClick?(e: MouseEvent): void;
}

type Options = ReactNode | ((api: OptionsAPI) => ReactNode);

export interface OptionsAPI {
  close(): void;
}

export default function T1MenuItem(props: IT1MenuItemProps) {
  const {
    label,
    link,
    textEllipsis = false,
    options,
    optionsExtras,
    sx,
    menuRef,
    tooltip,
    tooltipProps,
    onClick: _onClick,
    ...rest
  } = props;
  
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  
  const onClick = useCallback((e: MouseEvent) => {
    _onClick?.(e);
    if (!e.isDefaultPrevented()) {
      link && navigate(link);
    }
  }, [_onClick]);
  
  const api = useMemo<OptionsAPI>(() => ({
    close: () => {
      setOptionsOpen(false);
    },
  }), []);

  return (
    <ListItem
      disablePadding
      secondaryAction={
        options && (
          <Box
            className="T1MenuItem-optionsButton"
            sx={{
              position: 'relative',
              left: 8,
              opacity: hover ? 1 : 0,
              transition: 'opacity .2s ease-out',
            }}
          >
            <Options
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={optionsOpen}
              onOpen={() => setOptionsOpen(true)}
              onClose={() => setOptionsOpen(false)}
            >
              {typeof options === 'function' ? options(api) : options}
            </Options>
            {typeof optionsExtras === 'function' ? optionsExtras(api) : optionsExtras}
          </Box>
        )
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={sx}
    >
      <ListItemButton
        className="T1MenuItem-root"
        onClick={onClick}
        {...rest}
      >
        <Label ellipsis={textEllipsis} tooltip={tooltip} tooltipProps={tooltipProps}>{label}</Label>
      </ListItemButton>
    </ListItem>
  )
}

interface ILabelProps {
  children: NonNullable<ReactNode>;
  ellipsis: boolean;
  tooltip?: ReactNode;
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>;
}

function Label(props: ILabelProps) {
  const {
    children,
    ellipsis,
    tooltip,
    tooltipProps,
  } = props;

  if (!ellipsis) {
    return (
      <Typography variant="body1" className="T1MenuItem-label">{children}</Typography>
    )
  }
  return (
    <Tooltip title={tooltip === undefined ? children : tooltip} placement="right" arrow {...tooltipProps}>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pr: 1,
          py: 0.5,
        }}
        className="T1MenuItem-label"
      >
        {children}
      </Typography>
    </Tooltip>
  )
}
