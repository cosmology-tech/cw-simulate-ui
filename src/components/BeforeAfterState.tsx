import React from "react";
import { OutputCard } from "./OutputCard";

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

const json = {
  array: [1, 2, 3],
  bool: true,
  object: {
    foo: 'bar',
  },
   object2: {
    foo: 'bar',
  },
   object3: {
    foo: 'bar',
  },
   object4: {
    foo: 'bar',
  },
   object5: {
    foo: 'bar',
  },
   object6: {
    foo: 'bar',
  },
};
export const BeforeAfterState = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <OutputCard response={json} placeholder="Your state will appear here" />
      <OutputCard
        response={json}
        placeholder="Your state traversal will appear here."
      />
    </div>
  );
};
