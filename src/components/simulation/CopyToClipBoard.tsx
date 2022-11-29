import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNotification } from "../../atoms/snackbarNotificationState";

interface ICopyToClipBoardProps {
  data: string;
  title: string;
}

export default function CopyToClipBoard({ data, title }: ICopyToClipBoardProps) {
  const setNotification = useNotification();
  return (
    <CopyToClipboard
      text={data}
      onCopy={() =>
        setNotification("Copied to clipboard", { severity: "info" })
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
