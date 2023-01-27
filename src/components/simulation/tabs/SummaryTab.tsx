import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import {
  ExecuteTraceLog,
  ReplyTraceLog,
  TraceLog,
} from "@terran-one/cw-simulate";
import { useState } from "react";
import YAML from "yaml";
import { useAccounts } from "../../../CWSimulationBridge";
import useSimulation from "../../../hooks/useSimulation";
import { stringifyFunds } from "../../../utils/typeUtils";
import Address from "../../chains/Address";
import TableLayout from "../../chains/TableLayout";
import T1JsonTree from "../../T1JsonTree";
import CopyToClipBoard from "../CopyToClipBoard";
import { EmptyTab, IInspectorTabProps, TabHeader, TabPaper } from "./Common";

export default function SummaryTab({ traceLog }: IInspectorTabProps) {
  const [checked, setChecked] = useState<boolean>(false);
  const sim = useSimulation();

  if (!traceLog) return <EmptyTab />;

  return (
    <Grid>
      <SummaryHeader traceLog={traceLog} />
      {traceLog.type === "instantiate" ? (
        <InstantiateSummary traceLog={traceLog} />
      ) : traceLog.type === "execute" ? (
        <ExecuteSummary traceLog={traceLog} />
      ) : traceLog.type === "reply" ? (
        <ReplySummary traceLog={traceLog} />
      ) : null}

      <Box sx={{ my: 2 }}>
        <Grid item container>
          <Typography variant="h6" my={1}>
            Balance
          </Typography>
          <BalanceView trace={traceLog} />
        </Grid>
        <Grid item container flexShrink={0} justifyContent="space-between">
          <Grid item sx={{ display: "flex" }}>
            <Typography variant="h6" my={1}>
              Message
            </Typography>
            <CopyToClipBoard
              data={
                checked
                  ? JSON.stringify(traceLog.msg)
                  : YAML.stringify(traceLog.msg)
              }
              title="Copy Message"
            />
          </Grid>
          <Box flexDirection={"row"} display={"flex"} alignItems={"center"}>
            <Typography variant="body2" mr={1}>
              {checked ? "JSON" : "YAML"}
            </Typography>
            <Switch
              checked={checked}
              onChange={() => setChecked((state) => !state)}
            />
          </Box>
        </Grid>

        <TabPaper>
          {checked ? (
            <T1JsonTree data={traceLog.msg} />
          ) : (
            <pre>{YAML.stringify(traceLog.msg)}</pre>
          )}
        </TabPaper>
      </Box>
    </Grid>
  );
}

function SummaryHeader({ traceLog }: { traceLog: TraceLog }) {
  const { type } = traceLog;

  let title: string;
  switch (type) {
    case "instantiate":
      title = "wasm/instantiate";
      break;
    case "execute":
      title = "wasm/execute";
      break;
    case "reply":
      title = "wasm/reply";
      break;
  }

  return <TabHeader>{title}</TabHeader>;
}

function InstantiateSummary({ traceLog }: { traceLog: ExecuteTraceLog }) {
  const { info } = traceLog;

  return (
    <>
      <SenderView info={info} />
    </>
  );
}

function ExecuteSummary({ traceLog }: { traceLog: ExecuteTraceLog }) {
  const { info } = traceLog;

  return (
    <>
      <SenderView info={info} />
    </>
  );
}

function ReplySummary({ traceLog }: { traceLog: ReplyTraceLog }) {
  return null;
}

function SenderView({ info }: { info: ExecuteTraceLog["info"] }) {
  const sim = useSimulation();
  const sender = useAccounts(sim, false)[info.sender] ?? {
    address: info.sender,
    funds: [],
  };

  return (
    <TableLayout
      rows={[
        {
          id: info.sender,
          sender: (
            <Address
              address={sender.address}
              label={sender.label}
              fontSize="small"
            />
          ),
          funds: stringifyFunds(info.funds),
        },
      ]}
      columns={{
        sender: "Sender",
        funds: "Funds",
      }}
      inspectorTable
      sx={{ mb: 2 }}
    />
  );
}

function BalanceView({ trace }: { trace: TraceLog }) {
  const sim = useSimulation();
  const contractBalance = sim.getBalance(
    trace.contractAddress,
    trace.storeSnapshot
  );
  const senderBalance = sim.getBalance(
    (trace as ExecuteTraceLog).info.sender,
    trace.storeSnapshot
  );
  const senderId = (trace as ExecuteTraceLog).info.sender;
  return (
    <TableLayout
      rows={[
        {
          id: trace.contractAddress,
          account: "Contract",
          funds: stringifyFunds(contractBalance ?? []),
        },
        {
          id: senderId,
          account: "Sender",
          funds: stringifyFunds(senderBalance ?? []),
        },
      ]}
      columns={{
        account: "Account",
        funds: "Balance",
      }}
      inspectorTable
      sx={{ mb: 2 }}
    />
  );
}
