import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ExecuteTraceLog, ReplyTraceLog, TraceLog } from "@terran-one/cw-simulate";
import React from "react";
import { chromeDark, ObjectInspector } from "react-inspector";
import YAML from "yaml";
import useSimulation from "../../hooks/useSimulation";
import { stringifyFunds } from "../../utils/typeUtils";
import TableLayout from "../chains/TableLayout";
import CollapsibleWidget from "../CollapsibleWidget";
import T1Container from "../grid/T1Container";

export interface InspectorTabProps {
  traceLog: TraceLog | undefined;
}

export const ResponseTab = ({traceLog}: InspectorTabProps) => {
  if (!traceLog) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let {response, contractAddress} = traceLog as TraceLog;

  if ("error" in response) {
    return (
      <Grid>
        <Typography variant="h3">Error</Typography>
        <Typography variant="h6">{response.error}</Typography>
      </Grid>
    );
  }

  let {messages, events, attributes, data} = response.ok;
  const attributesRowData = attributes.map((attribute, index) => {
    return {
      id: `${index}`,
      key: attribute.key,
      value: attribute.value,
    };
  });

  const eventsRowData = events.map((event, index) => {
    return {
      id: `${index}`,
      type: event.type,
      attributes: event.attributes.map((attribute) => {
        return attribute.key + ": " + attribute.value;
      }).join(", "),
    };
  });

  const messagesRowData = messages.map((message, index) => {
    return {
      sno: `${index}`,
      id: `${message.id}`,
      content: YAML.stringify(message.msg, {indent: 2}),
      reply_on: message.reply_on,
    };
  });

  return (
    <Grid sx={{height: "100%"}}>
      <CollapsibleWidget title={'Messages'} collapsed={messagesRowData.length !== 0}>
        {messagesRowData.length > 0 ? (
          <T1Container>
            <TableLayout
              rows={messagesRowData}
              columns={{
                sno: "#",
                id: "ID",
                content: "Content",
                reply_on: "Reply On",
              }}
              inspectorTable={true}
            />
          </T1Container>
        ) : (
          <Typography variant="body2" sx={{textAlign: 'center', p: 5}}>No Messages to
            show</Typography>
        )}
      </CollapsibleWidget>
      <CollapsibleWidget title={'Events'} collapsed={eventsRowData.length !== 0}>
        {eventsRowData.length > 0 ? (
          <T1Container>
            <TableLayout
              rows={eventsRowData}
              columns={{
                id: "#",
                type: "Type",
                attributes: "Attributes",
              }}
              inspectorTable={true}
            />
          </T1Container>
        ) : (
          <Typography variant="body2" sx={{textAlign: 'center', p: 5}}>No Events to
            show</Typography>
        )}
      </CollapsibleWidget>
      <CollapsibleWidget title={'Attributes'} collapsed={attributesRowData.length !== 0}>
        {attributesRowData.length > 0 ? (
          <T1Container>
            <TableLayout
              rows={attributesRowData}
              columns={{
                id: "#",
                key: "KEY",
                value: "VALUE",
              }}
              inspectorTable={true}
            />
          </T1Container>
        ) : (
          <Typography variant="body2" sx={{textAlign: 'center', p: 5}}>No Attributes to
            show</Typography>
        )}
      </CollapsibleWidget>
      <CollapsibleWidget title={'Data'} collapsed={!!data}>
        {data ? (
          <Typography variant="body2">{data}</Typography>
        ) : (
          <Typography variant="body2" sx={{textAlign: 'center', p: 5}}>No Data to show</Typography>
        )}
      </CollapsibleWidget>
    </Grid>
  );
};

export const SummaryTab = ({traceLog}: InspectorTabProps) => {
  if (!traceLog) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }
  console.log(traceLog);
  
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
        <Paper
          sx={{
            p: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            overflow: 'auto',
            maxHeight: 250,
          }}
        >
          <pre>{YAML.stringify(traceLog.msg)}</pre>
        </Paper>
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
  
  return (
    <Typography variant="h6" fontWeight="bold" mb={1}>
      {title}
    </Typography>
  )
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

const combineLogs = (traceLog: TraceLog): any[] => {
  let res = [...traceLog.logs];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(combineLogs(t));
    });
  }
  return res;
};

const INSPECTOR_THEME: any = {
  ...chromeDark,
  BASE_BACKGROUND_COLOR: "rgba(0, 0, 0, 0)",
};

const CallListItem = ({
  call,
  ix,
}: {
  call: { args: { [k: string]: any }; result: any; fn: string };
  ix: number;
}) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography
          fontFamily={"JetBrains Mono"}
          sx={{wordWrap: "break-word"}}
        >
          [{ix}] {call.fn}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table style={{wordBreak: "break-word"}}>
          <ObjectInspector
            theme={INSPECTOR_THEME}
            data={call.args}
            style={{backgroundColor: "transparent"}}
          />
        </table>
        <h4>Result</h4>
        {call.result ? (
          <Typography variant="body2" sx={{wordBreak: "break-word"}}>
            {JSON.stringify(call.result, null, 2)}
          </Typography>
        ) : (
          <Typography variant="body2">None</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const LogsTab = ({traceLog}: InspectorTabProps) => {
  if (!traceLog) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let combinedLogs = combineLogs(traceLog).filter((log) => log.type === "call");

  return (
    <Grid sx={{height: "100%", width: "100%"}}>
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
          <Typography variant="caption">No Logs to show.</Typography>
        </Grid>
      ) : (
        combinedLogs.map((log, index) => (
          <CallListItem ix={index} key={`a-${index}`} call={log}/>
        ))
      )}
    </Grid>
  );
};
