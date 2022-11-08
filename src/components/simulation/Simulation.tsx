import React, { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { Theme } from "@mui/material/styles/createTheme";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import type { SxProps } from "@mui/system/styleFunctionSx";
import { GridSizeProps } from "../../utils/typeUtils";
import { ExecuteQuery } from "./ExecuteQuery";
import { StateRenderer } from "./StateRenderer";
import StateStepper from "./StateStepper";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import { responseState } from "../../atoms/reponseState";
import T1Container from "../grid/T1Container";
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded';

const StyledPaper = styled(Paper)(({theme}) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

const Simulation = () => {
  const {instanceAddress: contractAddress} = useParams();
  const [, setResponse] = useAtom(responseState);
  const isFileUploaded = useAtomValue(fileUploadedState);
  const [showExecuteQuery, setShowExecuteQuery] = useState(true);
  return (
    <SplitView className="T1Simulation-root">
      <Column xs={4} className="T1Simulation-left">
        {showExecuteQuery ?
          <Typography sx={{textAlign: 'center'}}>
            <MinimizeRoundedIcon fontSize="small" onClick={() => setShowExecuteQuery(false)}/>
            Hide Execute & Query
          </Typography>
          : <Typography sx={{textAlign: 'center'}}>
            <ExpandCircleDownOutlinedIcon
              fontSize="small" onClick={() => setShowExecuteQuery(true)}/>
            Show Execute & Query
          </Typography>}
        {showExecuteQuery && <Widget size={4}>
          <ExecuteQuery
            setResponse={setResponse}
            contractAddress={contractAddress!}
          />
        </Widget>}
        <Widget sx={{p: 1}} size={showExecuteQuery ? 7 : 11}>
          <StateStepper contractAddress={contractAddress!}/>
        </Widget>
      </Column>
      <Column xs={8} className="T1Simulation-right">
        <Widget size={6}>
          <StateRenderer isFileUploaded={isFileUploaded}/>
        </Widget>
      </Column>
    </SplitView>
  );
};

export default Simulation;

interface ISplitViewProps {
  children?: ReactNode;
  className?: string;
}

function SplitView({children, ...props}: ISplitViewProps) {
  return (
    <Grid
      container
      direction="row"
      spacing={2}
      sx={{
        height: "100%",
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}

interface IColumnProps extends GridSizeProps {
  children?: ReactNode;
  className?: string;
}

function Column({children, ...props}: IColumnProps) {
  const theme = useTheme();
  
  return (
    <Grid
      item
      {...props}
      sx={{
        height: "100%",
      }}
    >
      <Grid
        container
        direction="column"
        component={StyledPaper}
        sx={{
          height: "100%",
          overflow: "auto",
          "> .T1Widget-root:not(:first-of-type)": {
            borderTop: `1px solid ${theme.palette.line}`,
          },
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
}

interface IWidgetProps {
  children?: ReactNode;
  /** An optional size between 1-12. At 12, size is 100%. Lower values are multiples of 100%/12. Default is 12. */
  size?: number;
  className?: string;
  sx?: SxProps<Theme>;
}

function Widget({
  children,
  size = 12,
  className,
  sx,
  ...props
}: IWidgetProps) {
  return (
    <Grid
      item
      sx={[
        {
          p: 2,
          height: `${(100 * size) / 12}%`,
          overflow: "auto",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      className={`T1Widget-root ${className}`}
      {...props}
    >
      <T1Container>
        {children}
      </T1Container>
    </Grid>
  );
}
