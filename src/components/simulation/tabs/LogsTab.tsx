import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { TraceLog } from "@terran-one/cw-simulate";
import { chromeDark, ObjectInspector } from "react-inspector";
import { EmptyTab, IInspectorTabProps } from "./Common";

const INSPECTOR_THEME: any = {
  ...chromeDark,
  BASE_BACKGROUND_COLOR: "transparent",
};

export default function LogsTab({traceLog}: IInspectorTabProps) {
  if (!traceLog) return <EmptyTab />

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

const combineLogs = (traceLog: TraceLog): any[] => {
  let res = [...traceLog.logs];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(combineLogs(t));
    });
  }
  return res;
};
