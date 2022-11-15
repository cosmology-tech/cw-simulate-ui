import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

interface IProps {
  onClick?(): void;
}

const CloseDiff = ({ onClick }: IProps) => {
  return (
    <Tooltip placement="top" title="Close compare states">
      <IconButton onClick={onClick}>
        <CancelSharpIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CloseDiff;
