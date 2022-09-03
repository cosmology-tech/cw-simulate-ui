import React from "react";
import { Switch, Tooltip } from "@mui/material";

interface IProps {
  isChecked: boolean;
  setIsChecked: (val: boolean) => void;
}

const DiffSwitch = ({isChecked, setIsChecked}: IProps) => {
  const onChange = (event: React.ChangeEvent, checked: boolean) => {
    setIsChecked(checked);
  };

  return (
      <Tooltip placement="top" title="Compare states">
        <Switch checked={isChecked} onChange={onChange}/>
      </Tooltip>
  );
};

export default DiffSwitch;
