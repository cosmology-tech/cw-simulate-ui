import React from "react";
import { IconButton } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import Tooltip from "@mui/material/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNotification } from "../../atoms/snackbarNotificationState";
interface ICopyToClipBoardProps {
  data: string;
  title: string;
}
export const CopyToClipBoard = ({ data, title }: ICopyToClipBoardProps) => {
  const setNotification = useNotification();
  return (
    <CopyToClipboard
      text={data}
      onCopy={() =>
        setNotification("Successfully Copied", { severity: "success" })
      }
    >
      <Tooltip title={title} placement="right-start">
        <IconButton aria-label="copy" size="small" sx={{ ml: 1 }}>
          <ContentCopyRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  );
};
