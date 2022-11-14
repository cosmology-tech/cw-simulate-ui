import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { TraceLog } from "@terran-one/cw-simulate/dist/types";
import { useAtomValue } from "jotai";
import { traceState } from "../../atoms/simulationPageAtoms";
import { Create, NoteAdd, QuestionMark, Reply } from "@mui/icons-material";

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
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
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
          <Box component={LabelIcon} color="inherit" sx={{mr: 1}}/>
          <Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  );
}


function getTreeItemIcon(trace: TraceLog) {
  switch (trace.type) {
    case "execute":
      return Create;
    case "instantiate":
      return NoteAdd;
    case "reply":
      return Reply;
    default:
      return QuestionMark;
  }
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

function renderTreeItems(traces?: TraceLog[], depth: number = 0) {
  console.log(depth);
  return traces?.map((trace) => {
    if (trace.trace?.length === 0) {
      return (
        <StyledTreeItem sx={{ml: depth > 1 ? depth * 2 : 0}}
                        nodeId={Math.random().toString(36).substr(2, 9)}
                        labelIcon={getTreeItemIcon(trace)}
                        labelText={getTreeItemLabel(trace)}/>
      )
    } else {
      return (
        <StyledTreeItem nodeId={Math.random().toString(36).substr(2, 9)}
                        labelIcon={getTreeItemIcon(trace)}
                        labelText={getTreeItemLabel(trace)}>
          {renderTreeItems(trace.trace, depth + 1)}
        </StyledTreeItem>
      )
    }
  });
}

export default function StateStepperV2() {
  const traces = useAtomValue(traceState);
  return (
    <TreeView
      aria-label="StateStepper"
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon/>}
      defaultExpandIcon={<ArrowRightIcon/>}
      defaultEndIcon={<div style={{width: 24}}/>}
      sx={{height: 264, flexGrow: 1, maxWidth: '100%', overflowY: 'auto'}}
    >
      {renderTreeItems(traces)}
    </TreeView>
  );
}
