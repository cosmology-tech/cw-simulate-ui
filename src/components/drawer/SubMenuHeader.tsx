import Grid from "@mui/material/Grid";
import { ReactNode, useMemo, useState } from "react";
import { useTheme } from "../../configs/theme";
import Options from "../Options";

export interface ISubMenuHeaderProps {
  title?: string;
  options?: Options;
  /** Modals & other popovers used in options. Can take a function receiving callbacks such as `close`. */
  optionsExtras?: OptionsExtras;
}

type Options = ReactNode[] | ((api: OptionsAPI) => ReactNode[]);
type OptionsExtras = ReactNode | ((api: OptionsAPI) => ReactNode);

type OptionsAPI = {
  close(): void;
}

export default function SubMenuHeader({
  title = '',
  options,
  optionsExtras,
}: ISubMenuHeaderProps)
{
  const [optionsOpen, setOptionsOpen] = useState(false);
  const theme = useTheme();
  
  const api = useMemo(() => ({
    close() {
      setOptionsOpen(false);
    },
  }), []);

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      sx={{
        minHeight: 56,
        p: 1,
        background: theme.palette.primary.light,
      }}
    >
      <Grid item flex={1} sx={{fontWeight: "bold"}}>{title}</Grid>
      {options && (
        <Grid item>
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
        </Grid>
      )}
    </Grid>
  )
}
