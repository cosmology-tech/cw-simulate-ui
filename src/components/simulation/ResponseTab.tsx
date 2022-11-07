import React from "react";
import {TraceLog} from "@terran-one/cw-simulate/dist/types";
import YAML from 'yaml';

interface SummaryTabProps {
  traceLog: TraceLog | {}
}

export const SummaryTab = ({traceLog}: SummaryTabProps) => {

  if (!('type' in traceLog)) {
    return (
      <span>Nothing here to see.</span>
    )
  }

  let { type, msg, env, response, contractAddress } = traceLog as TraceLog;

  return (
    <div>
      <h3>wasm/execute</h3>
      <table>
        <tr>
          <td>Sender</td>
          <td>{ contractAddress }</td>
        </tr>
        <tr>
          <td>Funds</td>
          <td>10000uluna</td>
        </tr>


      </table>
      <h4>ExecuteMsg</h4>
      <pre>
        { YAML.stringify(msg) }
      </pre>
    </div>
  )
}
