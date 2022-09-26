import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, styled, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import TreeItem from "@mui/lab/TreeItem";
import { MouseEventHandler, useCallback, useState, useRef, ReactNode, useMemo, useEffect, useContext } from "react";
import { MenuDrawerContext } from "./T1Drawer";

export interface IT1TreeItemProps {
  children?: ReactNode;
  nodeId: string;
  label: NonNullable<ReactNode>;
  link?: boolean | string;
  /** If true, overflowing label text will be hidden behind ellipsis. */
  textEllipsis?: boolean;
  options?: Options;
  /** Additional menus or popovers for `options` items. */
  optionsExtras?: Options;
  icon?: ReactNode;
  sx?: SxProps<Theme>;
  menuRef?: React.Ref<HTMLUListElement>;
}

type Options = ReactNode | ((api: OptionsAPI) => ReactNode)
export interface OptionsAPI {
  close(): void;
}

export default function T1TreeItem(props: IT1TreeItemProps) {
  const {
    label,
    link,
    textEllipsis = false,
    options,
    optionsExtras,
    sx,
    menuRef,
    ...rest
  } = props;

  const [showOptions, setShowOptions] = useState(false);
  const rootRef = useRef<Element>(null);
  const optsBtnRef = useRef<HTMLButtonElement>(null);
  const menuApi = useContext(MenuDrawerContext);

  const handleClickOptions = useCallback<MouseEventHandler>(e => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(true);
  }, []);
  
  const api = useMemo(() => ({
    close: () => {setShowOptions(false)},
  }), []);
  
  useEffect(() => {
    menuApi.register({
      nodeId: rest.nodeId,
      link,
    });
    
    return () => {
      menuApi.unregister(rest.nodeId);
    }
  }, [link]);

  return (
    <TreeItem
      ref={rootRef}
      label={
        <Box
          sx={{
            position: 'relative',
            py: 0.5,
          }}
          className="T1TreeItem-label"
        >
          <Label ellipsis={textEllipsis}>{label}</Label>
          {options && (
            <Box
              className="T1TreeItem-optionsButton"
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                opacity: 0,
                pr: 1,
                transition: 'opacity .2s ease-out',
                transform: 'translateY(-50%)',
              }}
              onClick={e => { e.stopPropagation() }}
            >
              <IconButton ref={optsBtnRef} onClick={handleClickOptions}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                open={showOptions}
                MenuListProps={{
                  ref: menuRef,
                }}
                onClose={() => setShowOptions(false)}
                anchorEl={optsBtnRef.current}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {typeof options === 'function' ? options(api) : options}
              </Menu>
              {typeof optionsExtras === 'function' ? optionsExtras(api) : optionsExtras}
            </Box>
          )}
        </Box>
      }
      sx={[
        {
          '& > .MuiTreeItem-content:hover .T1TreeItem-optionsButton': {
            opacity: 1,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  )
}

interface ILabelProps {
  children: NonNullable<ReactNode>;
  ellipsis: boolean;
}

function Label(props: ILabelProps) {
  const {
    children,
    ellipsis,
  } = props;
  
  if (!ellipsis) {
    return (
      <Typography variant="body1">{children}</Typography>
    )
  }
  return (
    <Tooltip title={children} placement="right">
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  )
}
