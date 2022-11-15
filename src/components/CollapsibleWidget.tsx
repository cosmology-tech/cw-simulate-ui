import CollapsibleIcon from "./CollapsibleIcon";
import { Box, Collapse, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import useTheme from "@mui/material/styles/useTheme";

export interface ICollabsibleWidgetProps {
  title: string;
  collapsed?: boolean;
  height?: number;
  children?: ReactNode;
}

function CollapsibleWidget({
  title,
  collapsed,
  height,
  children,
}: ICollabsibleWidgetProps) {
  const theme = useTheme();
  const expanded = collapsed === undefined ? true : collapsed;
  const [show, setShow] = useState<boolean>(expanded);

  useEffect(() => {
    setShow(expanded);
  }, [collapsed]);

  return (
    <Box sx={{borderRadius: 1, overflow: "hidden", pb: 0.5}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: theme.palette.common.black,
          color: theme.palette.common.white,
          cursor: "pointer",
          py: 0.5,
          px: 1,
        }}
        onClick={() => setShow((curr) => !curr)}
      >
        <CollapsibleIcon expanded={show}/>
        <Typography sx={{fontSize: "1.1rem"}}>{title}</Typography>
      </Box>
      <Collapse in={show}>
        <Box sx={{height: expanded ? 280 : 'fit-content'}}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

export default CollapsibleWidget;
