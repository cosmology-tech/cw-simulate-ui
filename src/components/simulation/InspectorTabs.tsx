import React from "react";
import YAML from "yaml";
import { TraceLog } from "@terran-one/cw-simulate/dist/types";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import T1Container from "../grid/T1Container";
import TableLayout from "../chains/TableLayout";
import { useTheme } from "../../configs/theme";
import CallMadeIcon from "@mui/icons-material/CallMade";

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
      content: YAML.stringify(message.msg),
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

      <Grid item flex={1} sx={{ height: "10vh", maxHeight: "20vh", mt: 1 }}>
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

  let { type, msg, env, response, contractAddress } = traceLog as TraceLog;

  return (
    <Grid>
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        wasm/execute
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          background: `${muiTheme.palette.common.black}`,
          textAlign: "center",
          color: muiTheme.palette.common.white,
        }}
      >
        Info
      </Typography>
      <Grid item flex={1} sx={{ height: "10vh", maxHeight: "20vh", mt: 1 }}>
        <T1Container>
          <TableLayout
            rows={[{ id: "1", sender: contractAddress, funds: "10000uluna" }]}
            columns={{
              id: "id",
              sender: "Sender",
              funds: "Funds",
            }}
            inspectorTable={true}
          />
        </T1Container>
      </Grid>
      <Typography variant="subtitle2">ExecuteMsg</Typography>
      <Typography variant="body2">{YAML.stringify(msg)}</Typography>
    </Grid>
  );
};

const combineCallHistory = (traceLog: TraceLog): any[] => {
  let res = [...traceLog.callHistory];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(combineCallHistory(t));
    });
  }
  return res;
};

const combineDebugMsgs = (traceLog: TraceLog): string[] => {
  let res = [...traceLog.debugMsgs];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(combineDebugMsgs(t));
    });
  }
  return res;
};

export const CallsTab = ({ traceLog }: InspectorTabProps) => {
  if (!("type" in traceLog)) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let { trace, callHistory } = traceLog;

  let combinedCallHistory = combineCallHistory(traceLog);

  return (
    <Grid>
      <List>
        {combinedCallHistory.map((call, i) => {
          return (
            <ListItem>
              <ListItemIcon>
                <CallMadeIcon />
              </ListItemIcon>
              <ListItemText primary={call.call.type} />
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
};

export const DebugTab = ({ traceLog }: InspectorTabProps) => {
  if (!("type" in traceLog)) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }
  let combinedDebugMsgs = combineDebugMsgs(traceLog);
  return (
    <Grid>
      <List>
        {combinedDebugMsgs.map((msg, i) => {
          return (
            <ListItem>
              <ListItemIcon>
                <CallMadeIcon />
              </ListItemIcon>
              <ListItemText primary={msg} />
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
};
