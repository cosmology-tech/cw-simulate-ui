import React from "react";
import YAML from "yaml";
import { TraceLog } from "@terran-one/cw-simulate";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import T1Container from "../grid/T1Container";
import TableLayout from "../chains/TableLayout";
import { useTheme } from "../../configs/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { chromeDark, ObjectInspector } from "react-inspector";

export interface InspectorTabProps {
  traceLog: TraceLog | {};
}

export const ResponseTab = ({ traceLog }: InspectorTabProps) => {
  const muiTheme = useTheme();
  if (!("type" in traceLog)) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let { response, contractAddress } = traceLog as TraceLog;

  if ("error" in response) {
    return (
      <Grid>
        <Typography variant="h3">Error</Typography>
        <Typography variant="h6">{response.error}</Typography>
      </Grid>
    );
  }

  let { messages, attributes, events, data } = response.ok;
  const attributesRowData = attributes.map((attribute, index) => {
    return {
      id: `${index}`,
      key: attribute.key,
      value: attribute.value,
    };
  });
  const messagesRowData = messages.map((message, index) => {
    return {
      sno: `${index}`,
      id: `${message.id}`,
      content: YAML.stringify(message.msg, { indent: 2 }),
      reply_on: message.reply_on,
    };
  });
  return (
    <Grid>
      {data && (
        <>
          <Typography
            variant="subtitle1"
            sx={{
              background: `${muiTheme.palette.common.black}`,
              textAlign: "center",
              color: muiTheme.palette.common.white,
            }}
          >
            Data
          </Typography>
          <Typography variant="body2">{data}</Typography>
        </>
      )}
      <Typography
        variant="subtitle1"
        sx={{
          background: `${muiTheme.palette.common.black}`,
          textAlign: "center",
          color: muiTheme.palette.common.white,
        }}
      >
        Attributes
      </Typography>
      <Grid item flex={1} sx={{ height: "10vh", maxHeight: "20vh", mt: 1 }}>
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
      </Grid>

      <Typography
        variant="subtitle1"
        sx={{
          background: `${muiTheme.palette.common.black}`,
          textAlign: "center",
          color: muiTheme.palette.common.white,
        }}
      >
        Messages
      </Typography>

      <Grid item flex={1} sx={{ height: "20vh", maxHeight: "20vh", mt: 1 }}>
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
      </Grid>
    </Grid>
  );
};

export const SummaryTab = ({ traceLog }: InspectorTabProps) => {
  const muiTheme = useTheme();
  if (!("type" in traceLog)) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let { type, msg, env, response, contractAddress, result } =
    traceLog as TraceLog;

  return (
    <Grid>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        wasm/execute
      </Typography>
      <Grid item flex={1} sx={{ height: "10vh", maxHeight: "20vh", mt: 1 }}>
        <T1Container>
          <TableLayout
            rows={[{ id: "1", sender: contractAddress, funds: "10000uluna" }]}
            columns={{
              sender: "Sender",
              funds: "Funds",
            }}
            inspectorTable={true}
          />
        </T1Container>
      </Grid>
      <h4>ExecuteMsg</h4>
      <pre>{YAML.stringify(msg)}</pre>
    </Grid>
  );
};

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
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography fontFamily={"JetBrains Mono"}>
          [{ix}] {call.fn}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <ObjectInspector
            theme={INSPECTOR_THEME}
            data={call.args}
            style={{ backgroundColor: "transparent" }}
          />
        </table>
        <h4>Result</h4>
        {call.result ? (
          <pre>{JSON.stringify(call.result, null, 2)}</pre>
        ) : (
          <pre>None</pre>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export const LogsTab = ({ traceLog }: InspectorTabProps) => {
  if (!("type" in traceLog)) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let combinedLogs = combineLogs(traceLog).filter((log) => log.type === "call");

  return (
    <Grid>
      {combinedLogs.map((log, index) => (
        <CallListItem ix={index} key={`a-${index}`} call={log} />
      ))}
    </Grid>
  );
};
