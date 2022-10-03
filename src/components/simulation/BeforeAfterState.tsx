import React from "react";
import { OutputCard } from "./OutputCard";
import { StateDiff } from "./StateDiff";

interface IProps {
  currentState: number;
  isChecked: boolean;
}

export const BeforeAfterState = ({currentState, isChecked}: IProps) => {
  const beforeStateJSON = {};
  const afterStateJSON = {};
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {!isChecked && (
        <OutputCard
          response={beforeStateJSON}
          placeholder="Your before state will appear here."
        />
      )}
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
