import { fromBase64, fromUtf8 } from "@cosmjs/encoding";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TreeView from "@mui/lab/TreeView";
import TreeItem, { treeItemClasses, TreeItemProps } from "@mui/lab/TreeItem";
import Typography from "@mui/material/Typography";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { TraceLog } from "@terran-one/cw-simulate/dist/types";
import { Map } from "immutable";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  blockState,
  stepTraceState,
} from "../../atoms/simulationPageAtoms";
import useMuiTheme from "@mui/material/styles/useTheme";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useContractTrace } from "../../CWSimulationBridge";
import useSimulation from "../../hooks/useSimulation";
import CollapsibleIcon from "../CollapsibleIcon";

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

interface IProps {
  contractAddress: string;
}

export default function StateStepper({ contractAddress }: IProps) {
  const sim = useSimulation();
  const traces = useContractTrace(sim, contractAddress);
  const setNotification = useNotification();
  
  const defaultExpanded = useMemo(() => getLastStepId(traces), []);
  const [activeStep, setActiveStep] = useState(getLastStepId(traces));
  const setStepTrace = useSetAtom(stepTraceState);
  const setStepState = useSetAtom(blockState);
  
  const handleClick = (e: SyntheticEvent, nodeId: string) => {
    setActiveStep(nodeId);
  };
  
  useEffect(() => {
    setActiveStep(getLastStepId(traces));
  }, [traces]);
  
  useEffect(() => {
    const executionStep = getNestedTrace(activeStep.split("-").map(Number), traces);
    setStepTrace(executionStep);
    if (!executionStep) {
      setNotification("No trace found for this step. This is likely an error.", {severity: 'warning'});
      return;
    }
    
    try {
      const state = extractState(executionStep.storeSnapshot, contractAddress);
      setStepState(state as any);
    }
    catch (err: any) {
      console.error(err);
      setNotification("Something went wrong during execution step processing. See console for details.", {severity: 'error'});
    }
  }, [traces, activeStep, contractAddress]);

  return (
    <TreeView
      aria-label="State Stepper"
      selected={activeStep}
      defaultExpanded={[defaultExpanded]}
      defaultCollapseIcon={<CollapsibleIcon expanded />}
      defaultExpandIcon={<CollapsibleIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: 264, flexGrow: 1, maxWidth: "100%", overflowY: "auto" }}
      onNodeSelect={handleClick}
    >
      {renderTreeItems(traces)}
    </TreeView>
  );
}

const getLastStepId = (traces: TraceLog[]) => `${Math.max(0, traces.length-1)}-0`;

function extractState(store: Map<string, any>, contractAddress: string) {
  const storage = store?.getIn(['wasm', 'contractStorage', contractAddress]) as Map<string, string> ?? Map();
  const pairs = Object.entries(storage.toObject())
    .map(([key, value]) => [
      fromUtf8(fromBase64(key)),
      JSON.parse(fromUtf8(fromBase64(value)))
    ] as [string, string]);
  return Object.fromEntries(pairs);
}

function getNestedTrace(tracePath: number[], traces: TraceLog[]) {
  if (!traces.length) return undefined;
  
  let traceObj: TraceLog = traces[tracePath[0]];
  for (let i = 1; i < tracePath.length - 1; i++) {
    if (traceObj.trace) {
      traceObj = traceObj.trace[tracePath[i]];
    }
    else {
      console.error(`Invalid trace path ${tracePath.join('-')}`);
      return undefined;
    }
  }
  return traceObj;
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
          sx={{ml: depth >= 1 ? depth * 2 : 0}}
          nodeId={
            `${prefix ? `${prefix}-` : ''}${index}-${depth}`
          }
          labelIcon={<NumberIcon number={index + 1} />}
          labelText={getTreeItemLabel(trace)}
        />
      );
    } else {
      return (
        <StyledTreeItem
          key={index}
          sx={{ml: depth >= 1 ? depth * 2 : 0}}
          nodeId={
            `${prefix ? `${prefix}-` : ''}${index}-${depth}`
          }
          labelIcon={<NumberIcon number={index + 1} />}
          labelText={getTreeItemLabel(trace)}
        >
          {renderTreeItems(
            trace.trace,
            depth + 1,
            `${prefix ? `${prefix}-` : ''}${index}`
          )}
        </StyledTreeItem>
      );
    }
  });
}
