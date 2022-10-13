import React from "react";
import { Button, Tooltip } from "@mui/material";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

interface IProps {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
}

const CloseDiff = ({ isVisible, setIsVisible }: IProps) => {
  const onClickHandler = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Tooltip placement="top" title="Close compare states">
      <Button onClick={onClickHandler}>
        <CancelSharpIcon />
      </Button>
    </Tooltip>
  );
};

export default CloseDiff;
