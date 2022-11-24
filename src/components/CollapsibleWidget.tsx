import { Theme } from "@mui/material/styles/createTheme";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system/styleFunctionSx";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "../configs/theme";
import { joinSx } from "../utils/reactUtils";
import CollapsibleIcon from "./CollapsibleIcon";
import { BeautifyJSON } from "./simulation/tabs/Common";

export interface ICollabsibleWidgetProps {
  title: string;
  collapsed?: boolean;
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  payload?: string;
  setPayload?: (val: string) => void;
  isValid?: boolean;
  isCollapsible?: boolean;
  isJSONEditor?: boolean;
}

function CollapsibleWidget({
  title,
  collapsed,
  height,
  minHeight,
  maxHeight,
  children,
  sx,
  payload,
  setPayload,
  isValid,
  isJSONEditor = false,
  isCollapsible = true,
}: ICollabsibleWidgetProps) {
  const theme = useTheme();
  const expanded = collapsed === undefined ? true : collapsed;
  const [show, setShow] = useState<boolean>(expanded);

  useEffect(() => {
    setShow(expanded);
  }, [collapsed]);

  return (
    <Box sx={joinSx({ borderRadius: 1, overflow: "hidden", pb: 0.5 }, sx)}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: theme.palette.common.black,
          color: theme.palette.common.white,
          cursor: "pointer",
          py: 0.5,
          px: 1,
        }}
      >
        <Box
          sx={{ width: `${isJSONEditor ? "90%" : "100%"}`, display: "flex" }}
          onClick={isCollapsible ? () => setShow((curr) => !curr) : undefined}
        >
          {isCollapsible && <CollapsibleIcon expanded={show} />}
          <Typography sx={{ fontSize: "1.1rem" }}>{title}</Typography>
        </Box>
        {isJSONEditor &&
          payload !== undefined &&
          setPayload !== undefined &&
          isValid !== undefined && (
            <BeautifyJSON
              payload={payload}
              setPayload={setPayload}
              isValid={isValid}
            />
          )}
      </Box>
      <Collapse in={show}>
        <Box sx={{ minHeight, maxHeight, height }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

export default CollapsibleWidget;
