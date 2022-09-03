import React from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Tooltip, Typography } from "@mui/material";
import { GREY_3 } from "../configs/variables";
import { Button } from "antd";

interface IProps {
  onInstantiateClickHandler: () => void;
}

export const Instantiate = ({onInstantiateClickHandler}: IProps) => {
  return (
      <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
      >
        <div>
          <Typography variant={'h6'} sx={{color: `${GREY_3}`}}>
            Instantiate your contract by click below button in order to execute
            and query.
          </Typography>
        </div>
        <div>
          {" "}
          <Tooltip title="Instantiate your contract">
            <Button type="default"
                    shape="circle"
                    size="large"
                    icon={<PlayCircleOutlined/>}
                    onClick={onInstantiateClickHandler}
            />
          </Tooltip>
        </div>
      </div>
  );
};
