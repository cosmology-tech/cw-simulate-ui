import { JsonCodeMirrorEditor } from "../components/JsonCodeMirrorEditor";
import { Box } from "@mui/material";
import { RecoilRoot } from "recoil";

export default {
  title: "JsonCodeMirrorEditor",
  component: JsonCodeMirrorEditor,
  decorators: [(storyFn: any) => <RecoilRoot>{storyFn()}</RecoilRoot>],
  args: {
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
