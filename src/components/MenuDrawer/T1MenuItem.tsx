import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, IconButton, Menu, SxProps, Theme, Typography } from "@mui/material";
import TreeItem from "@mui/lab/TreeItem";
import { MouseEventHandler, useCallback, useState, useRef, ReactNode, useMemo } from "react";

export interface IT1TreeItemProps {
  children?: ReactNode;
  nodeId: string;
  label: string;
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
    options,
    optionsExtras,
    sx,
    menuRef,
    ...rest
  } = props;

  const [showOptions, setShowOptions] = useState(false);
  const rootRef = useRef<Element>(null);
  const optsBtnRef = useRef<HTMLButtonElement>(null);

  const handleClickOptions = useCallback<MouseEventHandler>(e => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(true);
  }, []);
  
  const api = useMemo(() => ({
    close: () => {setShowOptions(false)},
  }), [])

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
          <Typography variant="body1">{label}</Typography>
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
