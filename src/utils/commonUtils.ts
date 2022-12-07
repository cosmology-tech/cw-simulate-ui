import { TraceLog } from "@terran-one/cw-simulate";
import { defaults } from '../configs/constants';

export const getStepTrace = (activeStep: string, trace: TraceLog[]) => {
  const activeStepArr = activeStep.split("-").map((ele) => Number(ele));
  let activeTrace: TraceLog = {} as TraceLog;
  for (let i = 0; i < activeStepArr.length - 1; i++) {
    activeTrace = activeTrace.trace
      ? activeTrace.trace[activeStepArr[i]]
      : trace[activeStepArr[i]];
  }
  return activeTrace;
};

export const getDefaultAccount = (chainId: string) =>
  Object.values(defaults.chains).find((config) => config.chainId === chainId) ??
  defaults.chains.terra;