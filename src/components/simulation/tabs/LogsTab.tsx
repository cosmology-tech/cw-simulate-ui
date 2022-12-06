import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DebugLog, TraceLog } from "@terran-one/cw-simulate";
import React, { ReactNode } from "react";
import { T1Accordion, T1AccordionSection } from "../../T1Accordion";
import T1JsonTree from "../../T1JsonTree";
import { EmptyTab, IInspectorTabProps } from "./Common";

export default function LogsTab({ traceLog }: IInspectorTabProps) {
  if (!traceLog) return <EmptyTab />;

  let combinedLogs = extractLogs(traceLog).filter((log) => log.type === "call");

  return (
    <Grid sx={{ height: "100%", width: "100%" }}>
      {combinedLogs.length === 0 ? (
        <Grid
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EmptyTab>No Logs to show.</EmptyTab>
        </Grid>
      ) : (
        <T1Accordion sx={{ width: '100%' }}>
          {combinedLogs.map((log, index) => (
            <T1AccordionSection
              title={<LogTitle log={log} index={index} />}
              sx={{ width: '100%' }}
            >
              <LogBody log={log} />
            </T1AccordionSection>
          ))}
        </T1Accordion>
      )}
    </Grid>
  );
}

interface ILogTitle {
  log: DebugLog;
  index: number;
}

const LogTitle = React.memo(({ log, index }: ILogTitle) => {
  return (
    <Typography
      fontFamily="JetBrains Mono"
      sx={{ wordWrap: 'break-word' }}
    >
      {log.type === 'print' ? (
        <>[{index}] Print</>
      ) : (
        <>[{index}] {log.fn}</>
      )}
    </Typography>
  )
});

interface ILogBodyProps {
  log: DebugLog;
}

const LogBody = ({ log }: ILogBodyProps) => {
  const SubsectionTitle = ({ children }: { children: string }) =>
    <Typography fontStyle="italic" fontWeight="bold">{children}</Typography>
  
  switch (log.type) {
    case 'print': return (
      <Typography fontFamily="JetBrains Mono">{log.message}</Typography>
    )
    case 'call': return (
      <>
        <SubsectionTitle>Arguments:</SubsectionTitle>
        <Box sx={{ wordBreak: 'break-word' }}>
          <T1JsonTree data={log.args} />
        </Box>
        {'result' in log && (<>
          <SubsectionTitle>Result:</SubsectionTitle>
          {formatResult(log.result)}
        </>)}
      </>
    )
  }
};

const extractLogs = (traceLog: TraceLog): DebugLog[] => {
  let res = [...traceLog.logs];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(extractLogs(t));
    });
  }
  return res;
};

function formatResult(result: string | number): ReactNode {
  if (typeof result !== 'string') return result.toString();
  try {
    const parsed = JSON.parse(result);
    if (typeof parsed !== 'object')
      return <Typography fontFamily="JetBrains Mono">{parsed}</Typography>
    return <T1JsonTree data={parsed} />
  }
  catch {
    return result;
  }
}
