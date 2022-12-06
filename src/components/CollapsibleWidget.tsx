import { Theme } from "@mui/material/styles/createTheme";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system/styleFunctionSx";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "../configs/theme";
import { joinSx } from "../utils/reactUtils";
import CollapsibleIcon from "./CollapsibleIcon";

export interface ICollabsibleWidgetProps {
  title: ReactNode;
  collapsed?: boolean;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  right?: ReactNode;
  collapsible?: boolean;
  className?: string;
  onClick?(): void;
  onToggle?(expanded: boolean): void;
  onExpand?(): void;
  onCollapse?(): void;
}

function CollapsibleWidget({
  title,
  collapsed,
  height,
  minHeight,
  maxHeight,
  children,
  sx,
  right,
  collapsible = true,
  className,
  onClick: _onClick,
  onToggle,
  onExpand,
  onCollapse,
}: ICollabsibleWidgetProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<boolean>(!collapsed);

  useEffect(() => {
    collapsed !== undefined && setExpanded(!collapsed);
  }, [collapsed]);
  
  const onClick = () => {
    setExpanded(!expanded);
    if (expanded) {
      onCollapse?.();
    } else {
      onExpand?.();
    }
    onToggle?.(expanded);
    _onClick?.();
  };

  return (
    <Box sx={joinSx({ borderRadius: 1, overflow: "hidden", pb: 0.5 }, sx)} className={`T1CollapsibleWidget-root ${className}`}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme.palette.common.black,
          color: theme.palette.common.white,
          cursor: collapsible ? "pointer" : undefined,
          py: 0.5,
          px: 1,
        }}
        className="T1CollapsibleWidget-titleBar"
      >
        <Box
          sx={{ display: "flex", flex: 1 }}
          onClick={collapsible ? onClick : undefined}
          className="T1CollapsibleWidget-title"
        >
          {collapsible && <CollapsibleIcon expanded={expanded} />}
          <Typography sx={{ fontSize: "1.1rem" }}>{title}</Typography>
        </Box>
        {right}
      </Box>
      <Collapse in={expanded} className="T1CollapsibleWidget-collapse">
        <Box sx={{ minHeight, maxHeight, height }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

export default CollapsibleWidget;
