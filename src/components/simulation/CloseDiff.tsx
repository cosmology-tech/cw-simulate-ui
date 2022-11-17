import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useSetAtom } from "jotai";
import React, { MouseEvent, useCallback } from "react";
import { compareStates } from "../../atoms/simulationPageAtoms";

interface IProps {
  onClick?(e: MouseEvent): void;
}

const CloseDiff = ({ onClick: _onClick }: IProps) => {
  const setCompareStates = useSetAtom(compareStates);
  
  const onClick = useCallback((e: MouseEvent) => {
    _onClick?.(e);
    if (!e.isDefaultPrevented()) {
      setCompareStates({
        state1: undefined,
        state2: undefined,
      });
    }
  }, [_onClick]);
  
  return (
    <Tooltip placement="top" title="Close compare states">
      <IconButton onClick={onClick}>
        <CancelSharpIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CloseDiff;
