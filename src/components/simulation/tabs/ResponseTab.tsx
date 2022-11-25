import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Attribute, Event, SubMsg, TraceLog } from "@terran-one/cw-simulate";
import YAML from "yaml";
import TableLayout from "../../chains/TableLayout";
import CollapsibleWidget from "../../CollapsibleWidget";
import T1Container from "../../grid/T1Container";
import BlockQuote from "../../BlockQuote";
import { EmptyTab, TabHeader } from "./Common";

export interface IResponseTabProps {
  traceLog: TraceLog | undefined;
}

export default function ResponseTab({ traceLog }: IResponseTabProps) {
  if (!traceLog) {
    return <Typography variant="caption">Nothing here to see.</Typography>;
  }

  let { response, contractAddress } = traceLog;

  if ("error" in response) {
    return (
      <>
        <TabHeader>Execution Error</TabHeader>
        <BlockQuote>{response.error}</BlockQuote>
      </>
    );
  }

  let { messages, events, attributes, data } = response.ok;
  if (!messages.length && !events.length && !attributes.length && !data) {
    return <EmptyTab />;
  }
  return (
    <Grid sx={{ position: "relative", height: "100%" }}>
      <T1Container>
        <ResponseMessages messages={messages} />
        <ResponseEvents events={events} />
        <ResponseAttributes attrs={attributes} />
        <ResponseData data={data} />
      </T1Container>
    </Grid>
  );
}

function ResponseMessages({ messages }: { messages: SubMsg[] }) {
  const data = messages.map((message, index) => {
    return {
      sno: `${index}`,
      id: `${message.id}`,
      content: (
        <BlockQuote sx={{ textAlign: "left" }}>
          <pre>{YAML.stringify(message.msg, { indent: 2 })}</pre>
        </BlockQuote>
      ),
      reply_on: message.reply_on,
    };
  });

  if (!data.length) return null;
  return (
    <CollapsibleWidget title="Messages" collapsed>
      <TableLayout
        rows={data}
        columns={{
          sno: "#",
          id: "ID",
          content: "Content",
          reply_on: "Reply On",
        }}
        keyField="sno"
        inspectorTable
        sx={{
          borderRadius: 0,
        }}
      />
    </CollapsibleWidget>
  );
}

function ResponseEvents({ events }: { events: Event[] }) {
  const data = events.map((event, index) => {
    return {
      id: `${index}`,
      type: event.type,
      attributes: event.attributes
        .map((attribute) => {
          return attribute.key + ": " + attribute.value;
        })
        .join(", "),
    };
  });

  if (!data.length) return null;
  return (
    <CollapsibleWidget title="Events">
      <TableLayout
        rows={data}
        columns={{
          id: "#",
          type: "Type",
          attributes: "Attributes",
        }}
        inspectorTable
        sx={{
          borderRadius: 0,
        }}
      />
    </CollapsibleWidget>
  );
}

function ResponseAttributes({ attrs }: { attrs: Attribute[] }) {
  const data = attrs.map((attribute, index) => {
    return {
      id: `${index}`,
      key: attribute.key,
      value: attribute.value,
    };
  });

  if (!data.length) return null;
  return (
    <CollapsibleWidget title="Attributes" collapsed>
      <TableLayout
        rows={data}
        columns={{
          id: "#",
          key: "KEY",
          value: "VALUE",
        }}
        inspectorTable
        sx={{
          borderRadius: 0,
        }}
      />
    </CollapsibleWidget>
  );
}

function ResponseData({ data }: { data: string | null }) {
  if (!data) return null;
  return (
    <CollapsibleWidget title="Data" collapsed>
      <BlockQuote>{data}</BlockQuote>
    </CollapsibleWidget>
  );
}
