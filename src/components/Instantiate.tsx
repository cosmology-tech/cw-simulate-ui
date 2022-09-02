import { Button, Tooltip, Typography } from "antd";
import React from "react";
import { PlayCircleOutlined } from '@ant-design/icons';

interface IProps {
    onInstantiateClickHandler:()=>void;
}

export const Instantiate = ({onInstantiateClickHandler}:IProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection:'column',
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Typography.Title level={4} disabled>
          Instantiate your contract by click below button in order to execute
          and query.
        </Typography.Title>
      </div>
      <div>
        {" "}
        <Tooltip title="Instantiate your contract">
          <Button type="default" shape="circle" size="large" icon={<PlayCircleOutlined />} onClick={onInstantiateClickHandler}/>
        </Tooltip>
      </div>
    </div>
  );
};
