import { ContractResponse } from "@terran-one/cw-simulate";
import React from "react";
import { IRequest } from "../../atoms/stepRequestState";
import { OutputCard } from "./OutputCard";

interface IProps {
  response:
    | JSON
    | undefined
    | IRequest
    | { ok: ContractResponse }
    | { error: any };
}

export const OutputRenderer = ({ response }: IProps) => {
  return (
    <OutputCard
      response={response}
      placeholder="Your step response will appear here."
    />
  );
};
