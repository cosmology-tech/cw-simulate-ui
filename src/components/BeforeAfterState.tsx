import React from "react";
import { IState } from "./ExecuteQuery";
import { OutputCard } from "./OutputCard";
import { StateDiff } from "./StateDiff";

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
  allStates: IState[];
  currentState: number;
  isChecked: boolean;
}
export const BeforeAfterState = ({ allStates, currentState, isChecked }: IProps) => {
  const [checked, setChecked] = React.useState(false);
  const beforeStateJSON =
    allStates[currentState].chainStateBefore.length > 0
      ? JSON.parse(window.atob(allStates[currentState].chainStateBefore))
      : "";
  const afterStateJSON = JSON.parse(
    window.atob(allStates[currentState].chainStateAfter)
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <OutputCard
        response={beforeStateJSON}
        placeholder="Your before state will appear here."
      />
      {!isChecked?<OutputCard
        response={afterStateJSON}
        placeholder="Your after state will appear here."
      />:<StateDiff beforeStateJSON={beforeStateJSON} afterStateJSON={afterStateJSON} />
      }
    </div>
  );
};
