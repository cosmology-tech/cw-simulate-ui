import React from "react";
import { Button, Tooltip, Typography } from "@mui/material";
import { GREY_3 } from "../configs/variables";
import { PlayCircleOutlined } from "@mui/icons-material";

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
          <Button onClick={onInstantiateClickHandler}>
            <PlayCircleOutlined style={{fontSize: "50px"}}/>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
