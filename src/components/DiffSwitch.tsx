import { Switch, Tooltip } from "antd";
import React from "react";

interface IProps {
  isChecked: boolean;
  setIsChecked: (val: boolean) => void;
}

const DiffSwitch = ({ isChecked, setIsChecked }: IProps) => {
  const onChange = (checked: any) => {
    console.log(`switch to ${checked}`);
    setIsChecked(checked);
  };

  return <Tooltip placement="top" title="Compare states">
        <Switch checked={isChecked} onChange={onChange} />
      </Tooltip>
     ;
};

export default DiffSwitch;
