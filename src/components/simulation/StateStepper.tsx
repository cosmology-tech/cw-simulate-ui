import * as React from "react";
import { SyntheticEvent, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses, TreeItemProps } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { TraceLog } from "@terran-one/cw-simulate/dist/types";
import { useAtomValue, useSetAtom } from "jotai";
import {
  blockState,
  currentStateNumber,
  stepRequestState,
  stepResponseState,
  stepTraceState,
  traceState,
} from "../../atoms/simulationPageAtoms";
import useMuiTheme from "@mui/material/styles/useTheme";
import { Map } from "immutable";

declare module "react" {
  interface CSSProperties {
    "--tree-view-color"?: string;
    "--tree-view-bg-color"?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: JSX.Element;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
  const { bgColor, color, labelIcon, labelInfo, labelText, ...other } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box sx={{ p: 1 }}>{labelIcon}</Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

type NumberIconProps = SvgIconProps & {
  number: number;
};

function NumberIcon<SvgIconComponent>({ number }: NumberIconProps) {
  const theme = useMuiTheme();
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        bgcolor: theme.palette.grey[900],
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: theme.palette.common.white, fontWeight: "bold" }}
      >
        {number}
      </Typography>
    </Box>
  );
}

function getTreeItemLabel(trace: TraceLog) {
  switch (trace.type) {
    case "reply":
      return `reply : ${trace.msg.id}`;
    case "instantiate":
      return "instantiate";
    case "execute":
      return Object.keys(trace.msg)[0];
    default:
      return "unknown";
  }
}

function renderTreeItems(
  traces: TraceLog[],
  depth: number = 0,
  prefix: string = ""
) {
  return traces?.map((trace, index) => {
    if (!trace.trace?.length) {
      return (
        <StyledTreeItem
          key={index}
          sx={{ ml: depth * 2 }}
          nodeId={
            prefix !== "" ? `${prefix}-${index}-${depth}` : `${index}-${depth}`
          }
          labelIcon={<NumberIcon number={index + 1} />}
          labelText={getTreeItemLabel(trace)}
        />
      );
    } else {
      return (
        <StyledTreeItem
          nodeId={
            prefix !== "" ? `${prefix}-${index}-${depth}` : `${index}-${depth}`
          }
          labelIcon={<NumberIcon number={index + 1} />}
          labelText={getTreeItemLabel(trace)}
        >
          {renderTreeItems(
            trace.trace,
            depth + 1,
            prefix !== "" ? `${prefix}-${index}` : `${index}`
          )}
        </StyledTreeItem>
      );
    }
  });
}
const getTrace = (locArray: string[], traces: TraceLog[]) => {
  let traceObj: TraceLog = traces[Number(locArray[0])];
  for (let i = 1; i < locArray.length - 1; i++) {
    if (traceObj.trace) {
      traceObj = traceObj.trace[Number(locArray[i])];
    }
  }
  return traceObj;
};
interface IProps {
  contractAddress: string;
}

export default function StateStepper({ contractAddress }: IProps) {
  const setStepTrace = useSetAtom(stepTraceState);
  const setStepState = useSetAtom(blockState);
  const stepRequestObj = useSetAtom(stepRequestState);
  const stepResponseObj = useSetAtom(stepResponseState);
  const traces = useAtomValue(traceState);
  const [activeStep, setActiveStep] = useState("");
  const currentState = useAtomValue(currentStateNumber);

  const handleStateView = (state: Map<string, any>) => {
    const entries =
      //@ts-ignore
      state?._root.entries[0][1]?._root?.entries[2][1]?._root?.entries[0][1]
        ?._root?.entries;
    setStepState(
      JSON.parse(
        `{\"${window.atob(entries[0][0])}\":${window.atob(entries[0][1])}}`
      )
    );
  };
  
  const getRequestObject = (currentTrace: TraceLog) => {
    const { env, type, msg } = currentTrace;
    const responseObj = {
      env: env,
      info:
        type === "execute" || type === "instantiate" ? currentTrace.info : {},
      executeMsg: type === "instantiate" ? { instantiate: msg } : msg,
    };
    return responseObj;
  };
  
  const handleClick = (e: SyntheticEvent, nodeId: string) => {
    setActiveStep(nodeId);
  };
  
  useEffect(() => {
    const executionStep = getTrace(activeStep.split("-"), traces);
    handleStateView(executionStep?.storeSnapshot);
    stepRequestObj(getRequestObject(executionStep));
    //@ts-ignore
    const resp = executionStep?.response.error
      ? //@ts-ignore
        { error: executionStep?.response.error }
      : executionStep?.response;
    stepResponseObj(resp);
    setStepTrace(executionStep);
  }, [activeStep, contractAddress]);

  useEffect(() => {}, [currentState]);

  return (
    <TreeView
      aria-label="StateStepper"
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: "100%", overflowY: "auto" }}
      onNodeSelect={handleClick}
    >
      {renderTreeItems(traces)}
    </TreeView>
  );
}
