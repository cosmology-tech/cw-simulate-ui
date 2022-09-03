import { JsonCodeMirrorEditor } from "../components/JsonCodeMirrorEditor";

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

export const Default = (args: any) => <JsonCodeMirrorEditor {...args} />