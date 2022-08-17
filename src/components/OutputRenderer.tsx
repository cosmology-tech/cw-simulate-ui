import { Typography } from "antd";
import React from "react";
import { JSONTree } from "react-json-tree";
import TopNavigation from "./TopNavigation";

const { Paragraph } = Typography;

const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

interface IProps {
  queryResponse: JSON | undefined;
  executeResponse: JSON | undefined;
  isFileUploaded: boolean;
}
export const OutputRenderer = ({
  queryResponse,
  executeResponse,
  isFileUploaded,
}: IProps) => {
  const json = {
    array: [1, 2, 3],
    bool: true,
    object: {
      foo: "bar",
    },
  };
  const [currentTab, setCurrentTab] = React.useState("state");
  const currentJSON =
    currentTab === "state"
      ? JSON.parse(window.atob(window.VM.backend.storage.dict['c3RhdGU=']))
      : currentTab === "query"
      ? queryResponse
      : executeResponse;
  return (
    <>
      <TopNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div>
        {isFileUploaded ? (
          <JSONTree data={currentJSON} theme={theme} invertTheme={false} />
        ) : (
          <Paragraph style={{ margin: "20px 20px" }}>
            {"No output to show."}
          </Paragraph>
        )}
      </div>
    </>
  );
};
