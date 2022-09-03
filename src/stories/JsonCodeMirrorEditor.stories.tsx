import { JsonCodeMirrorEditor } from "../components/JsonCodeMirrorEditor";
import { Box } from "@mui/material";

export default {
  title: "JsonCodeMirrorEditor",
  component: JsonCodeMirrorEditor,
  args: {
    value: {
      json: "Enter your JSON here",
    },
    onChange: (val: string) => console.log(val),
    setPayload: (val: string) => console.log(val),
  }
}

export const Default = (args: any) => {
  return (
      <Box sx={{maxWidth: "80%"}}>
        <JsonCodeMirrorEditor {...args} />
      </Box>
  );
}