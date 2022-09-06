interface IProps {
  logs: string[];
}

export const ConsoleRenderer = ({logs}: IProps) => {
  const renderedLogs = [];

  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    if (typeof log != "object") {
      renderedLogs.push(
        <p style={{fontFamily: "Monaco, Consolas, 'Courier New', monospace"}} key={i}>
          {log}
        </p>
      );
    } else {
      renderedLogs.push(
        <p style={{fontFamily: "Monaco, Consolas, 'Courier New', monospace"}} key={i}>
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
