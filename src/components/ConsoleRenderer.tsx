import { Typography } from "antd";
import { json } from "stream/consumers";
import { isNumberObject } from "util/types";

interface IProps {
  logs: string[];
}
export const ConsoleRenderer = ({ logs }: IProps) => {
  const renderedLogs = [];

  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    if (typeof log != "object") {
      renderedLogs.push(
        <li
          style={{ fontFamily: "Monaco, Consolas, 'Courier New', monospace" }}
          key={i}
        >
          {log}
        </li>
      );
    } else {
      renderedLogs.push(
        <li
          style={{ fontFamily: "Monaco, Consolas, 'Courier New', monospace" }}
          key={i}
        >
          {JSON.stringify(log)}
        </li>
      );
    }
  }
  return (
    <>
      <ul>{renderedLogs}</ul>
    </>
  );
};
