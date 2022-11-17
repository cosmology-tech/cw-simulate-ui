import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ExecuteTraceLog, ReplyTraceLog, TraceLog } from "@terran-one/cw-simulate";
import YAML from 'yaml';
import useSimulation from "../../../hooks/useSimulation";
import { stringifyFunds } from "../../../utils/typeUtils";
import TableLayout from "../../chains/TableLayout";
import { EmptyTab, IInspectorTabProps, TabHeader, TabPaper } from "./Common";

export default function SummaryTab({traceLog}: IInspectorTabProps) {
  if (!traceLog) return <EmptyTab />
  
  return (
    <Grid>
      <SummaryHeader traceLog={traceLog} />
      
      {traceLog.type === 'instantiate'
      ? <InstantiateSummary traceLog={traceLog} />
      : traceLog.type === 'execute'
      ? <ExecuteSummary traceLog={traceLog} />
      : traceLog.type === 'reply'
      ? <ReplySummary traceLog={traceLog} />
      : null
      }
      
      <Box sx={{ my: 2 }}>
        <Typography variant="h6" my={1}>Message</Typography>
        <TabPaper>
          <pre>{YAML.stringify(traceLog.msg)}</pre>
        </TabPaper>
      </Box>
    </Grid>
  );
};

function SummaryHeader({traceLog}: {traceLog: TraceLog}) {
  const { type } = traceLog;
  
  let title: string;
  switch (type) {
    case 'instantiate':
      title = 'wasm/instantiate';
      break;
    case 'execute':
      title = 'wasm/execute';
      break;
    case 'reply':
      title = 'wasm/reply';
      break;
  }
  
  return <TabHeader>{title}</TabHeader>
}

function InstantiateSummary({traceLog}: {traceLog: ExecuteTraceLog}) {
  const { info } = traceLog;
  
  return (
    <>
      <SenderView info={info} />
    </>
  )
}

function ExecuteSummary({traceLog}: {traceLog: ExecuteTraceLog}) {
  const { info } = traceLog;
  
  return (
    <>
      <SenderView info={info} />
    </>
  )
}

function ReplySummary({traceLog}: {traceLog: ReplyTraceLog}) {
  return null;
}

function SenderView({info}: {info: ExecuteTraceLog['info']}) {
  const sim = useSimulation();
  
  return (
    <TableLayout
      rows={[{sender: sim.shortenAddress(info.sender), funds: stringifyFunds(info.funds) }]}
      keyField="sender"
      columns={{
        sender: "Sender",
        funds: "Funds",
      }}
      inspectorTable
      sx={{mb: 2}}
    />
  )
}
