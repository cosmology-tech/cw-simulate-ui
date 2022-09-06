import React from "react";
import { IState } from "./ExecuteQuery";
import { OutputCard } from "./OutputCard";
import { StateDiff } from "./StateDiff";

interface IProps {
  allStates: IState[];
  currentState: number;
  isChecked: boolean;
}

export const BeforeAfterState = ({
  allStates,
  currentState,
  isChecked,
}: IProps) => {
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
      {!isChecked ? (
        <OutputCard
          response={afterStateJSON}
          placeholder="Your after state will appear here."
        />
      ) : (
        <StateDiff
          beforeStateJSON={beforeStateJSON}
          afterStateJSON={afterStateJSON}
        />
      )}
    </div>
  );
};
