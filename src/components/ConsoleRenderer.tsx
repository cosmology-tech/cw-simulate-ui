interface IProps {
  logs: string[];
}

const setLogColor = (log: string) => {
  if (log.toString().includes("Error")) {
    return "red";
  }
  return "green";
}

export const ConsoleRenderer = ({logs}: IProps) => {
  const renderedLogs = [];

  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    if (typeof log != "object") {
      renderedLogs.push(
        <p style={{
          fontFamily: "Monaco, Consolas, 'Courier New', monospace",
          color: `${setLogColor(log)}`
        }} key={i}>
          {log}
        </p>
      );
    } else {
      renderedLogs.push(
        <p style={{
          fontFamily: "Monaco, Consolas, 'Courier New', monospace",
          color: `${setLogColor(log)}`
        }} key={i}>
          {JSON.stringify(log)}
        </p>
      );
    }
  }
  return (
    <>
      {renderedLogs}
    </>
  );
};
