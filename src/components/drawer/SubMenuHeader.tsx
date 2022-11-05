import { ListItemIcon, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import { ReactNode, useState } from "react";
import { ORANGE_5_2 } from "../../configs/variables";
import Options from "../Options";

export interface ISubMenuHeaderProps {
  title?: string;
  options?: ReactNode;
}

export default function SubMenuHeader({
  title = '',
  options,
}: ISubMenuHeaderProps)
{
  const [optionsOpen, setOptionsOpen] = useState(false);
  
  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      sx={{
        minHeight: 56,
        p: 1,
        background: ORANGE_5_2,
      }}
    >
      <Grid item flex={1}>{title}</Grid>
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
            {options}
          </Options>
        </Grid>
      )}
    </Grid>
  )
}
