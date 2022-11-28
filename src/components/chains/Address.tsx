import CopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { useCallback } from "react";
import useSimulation from "../../hooks/useSimulation";
import { joinSx, useCopyToClipboard } from "../../utils/reactUtils";
import { SxProps } from "../../utils/typeUtils";

type PickedProps = Pick<TypographyProps,
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'textAlign'
>;

export type AddressProps = PickedProps & {
  address: string;
  gutterBottom?: boolean;
  long?: boolean;
  className?: string;
  sx?: SxProps;
}

export default function Address({ address, gutterBottom, long, className, sx, ...props }: AddressProps) {
  const sim = useSimulation();
  const copyToClipboard = useCopyToClipboard();
  const onClick = useCallback(() => {
    copyToClipboard(address);
  }, [address]);
  
  const title = (
    <Typography variant="body2">{address}</Typography>
  );
  
  return (
    <Tooltip
      title={!long && title}
      className="T1Address-tooltip"
      componentsProps={{
        tooltip: {
          style: {
            maxWidth: 'none',
          },
        },
      }}
    >
      <Box
        sx={joinSx({ display: "inline-flex", alignItems: "center" }, sx)}
        className={`T1Address-root ${className}`}
      >
        <Typography
          {...props}
          className="T1Address-address"
        >
          {long ? address : sim.shortenAddress(address)}
        </Typography>
        <IconButton onClick={onClick} className="T1Address-copy" disabled={!navigator.clipboard}>
          <CopyIcon fontSize="small" />
        </IconButton>
      </Box>
    </Tooltip>
  )
}
