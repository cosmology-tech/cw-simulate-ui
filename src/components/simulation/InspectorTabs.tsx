import React from "react";
import YAML from 'yaml';
import {TraceLog} from "@terran-one/cw-simulate/dist/types";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowsProp,
  GridToolbar,
  GridToolbarQuickFilter
} from "@mui/x-data-grid";

export interface InspectorTabProps {
  traceLog: TraceLog | {}
}

export const ResponseTab = ({traceLog}: InspectorTabProps) => {

  if (!('type' in traceLog)) {
    return (
      <span>Nothing here to see.</span>
    )
  }

  let {response, contractAddress} = traceLog as TraceLog;

  if ('error' in response) {
    return (
      <div>
        <h3>Error</h3>
        <pre>
          {response.error}
        </pre>
      </div>
    )
  }

  let {messages, attributes, events, data} = response.ok;

  return (
    <div>
      <h2>Response</h2>
      <h3>Data</h3>
      {data && <pre>{data}</pre>}
      <h3>Attributes</h3>
      <table>
        <thead>
        <th>#</th>
        <th>Key</th>
        <th>Value</th>
        </thead>
        <tbody>
        {attributes.map((a, i) => {
          return (
            <tr key={`attr-i`}>
              <td>{i}</td>
              <td>{a.key}</td>
              <td>{a.value}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <h3>Messages</h3>
      <table>
        <thead>
        <th>#</th>
        <th>ID</th>
        <th>Content</th>
        <th>Reply On</th>
        </thead>
        <tbody>
        {messages.map((m, i) => {
          return (
            <tr key={i}>
              <td>{i}</td>
              <td>{m.id}</td>
              <td>
                <pre>{YAML.stringify(m.msg)}</pre>
              </td>
              <td>{m.reply_on}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}


export const SummaryTab = ({traceLog}: InspectorTabProps) => {

  if (!('type' in traceLog)) {
    return (
      <span>Nothing here to see.</span>
    )
  }

  let {type, msg, env, response, contractAddress} = traceLog as TraceLog;

  return (
    <div>
      <h3>wasm/execute</h3>
      <table>
        <tr>
          <td>Sender</td>
          <td>{contractAddress}</td>
        </tr>
        <tr>
          <td>Funds</td>
          <td>10000uluna</td>
        </tr>


      </table>
      <h4>ExecuteMsg</h4>
      <pre>
        {YAML.stringify(msg)}
      </pre>
    </div>
  )
}


const combineCallHistory = (traceLog: TraceLog): any[] => {
  let res = [...traceLog.callHistory];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(combineCallHistory(t));
    });
  }
  return res
}

const combineDebugMsgs = (traceLog: TraceLog): string[] => {
  let res = [...traceLog.debugMsgs];
  if (traceLog.trace) {
    traceLog.trace.forEach((t) => {
      res = res.concat(combineDebugMsgs(t));
    });
  }
  return res
}

export const CallsTab = ({traceLog}: InspectorTabProps) => {

  if (!('type' in traceLog)) {
    return (
      <span>Nothing here to see.</span>
    )
  }

  let {trace, callHistory} = traceLog;

  let combinedCallHistory = combineCallHistory(traceLog);


  return (
    <div>
      <ul>
        {combinedCallHistory.map((call, i) => {
          return (
            <li key={`call-${i}`}>
              <span>{call.call.type}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


export const DebugTab = ({traceLog}: InspectorTabProps) => {
  if (!('type' in traceLog)) {
    return (
      <span>Nothing here to see.</span>
    )
  }

  return (
      <div>
        <table>
          <thead>
            <th>ID</th>
          </thead>
        </table>
      </div>
  );
}
