import React from "react";
import {TraceLog} from "@terran-one/cw-simulate/dist/types";
import YAML from 'yaml';

interface ResponseTabProps {
  traceLog: TraceLog | {}
}

export const ResponseTab = ({traceLog}: ResponseTabProps) => {

  if (!('type' in traceLog)) {
    return (
      <span>Nothing here to see.</span>
    )
  }

  let { response, contractAddress } = traceLog as TraceLog;

  if ('error' in response) {
    return (
      <div>
        <h3>Error</h3>
        <pre>
          { response.error }
        </pre>
      </div>
    )
  }

  let { messages } = response.ok;

  return (
    <div>
      <table>
        <thead>
          <th>#</th>
          <th>ID</th>
          <th>Content</th>
          <th>Reply On</th>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  )
}
