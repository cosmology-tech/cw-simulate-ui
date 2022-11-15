import CollapsibleIcon from "./CollapsibleIcon";
import { Box, Collapse, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import useTheme from "@mui/material/styles/useTheme";

export interface ICollabsibleWidgetProps {
  title: string;
  collapsed?: boolean;
  height?: number;
  children?: ReactNode;
}

function CollapsibleWidget({
  title,
  height,
  children,
}: ICollabsibleWidgetProps) {
  const theme = useTheme();
  const [show, setShow] = useState<boolean>(true);
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
        <Box sx={{height: 280}}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}

export default CollapsibleWidget;
