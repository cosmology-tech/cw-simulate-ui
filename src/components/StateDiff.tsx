import React from "react";
import { Card } from "antd";
import ReactJsonViewCompare from "react-json-view-compare";

interface IProps {
  beforeStateJSON: JSON | undefined | any;
  afterStateJSON: JSON | undefined | any;
}
export const StateDiff = ({ beforeStateJSON, afterStateJSON }: IProps) => {
  return (
    <Card
      style={{ width: "100%", margin: 10, overflow: "scroll" }}
      bordered
      bodyStyle={{ padding: "10" }}
    >
      <ReactJsonViewCompare
        oldData={beforeStateJSON}
        newData={afterStateJSON}
      />
    </Card>
  );
};
