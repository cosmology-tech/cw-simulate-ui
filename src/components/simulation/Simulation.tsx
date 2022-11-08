import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { Theme } from "@mui/material/styles/createTheme";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import type { SxProps } from "@mui/system/styleFunctionSx";
import React, { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import { responseState } from "../../atoms/reponseState";
import { GridSizeProps } from "../../utils/typeUtils";
import T1Container from "../grid/T1Container";
import { ExecuteQuery } from "./ExecuteQuery";
import { StateRenderer } from "./StateRenderer";
import StateStepper from "./StateStepper";
import CollapsibleIcon from "../CollapsibleIcon";
import { QueryResponseTab } from "./QueryResponseTab";
import { OutputCard } from "./OutputCard";

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

const Simulation = () => {
  const { instanceAddress: contractAddress } = useParams();
  const isFileUploaded = useAtomValue(fileUploadedState);
  const response = useAtomValue(responseState);
  return (
    <SplitView className="T1Simulation-root">
      <Column xs={4} className="T1Simulation-left">
        <CollapsibleExecuteQuery contractAddress={contractAddress!} />
        <Divider sx={{ my: 1 }} />
        <StateStepper contractAddress={contractAddress!} />
      </Column>
      <Column xs={8} className="T1Simulation-right">
        <Widget size={6}>
          <StateRenderer isFileUploaded={isFileUploaded} />
        </Widget>
        <Widget size={6}>
          <Grid
            item
            container
            direction="column"
            height="100%"
            width="50%"
            gap={2}
            flexWrap="nowrap"
          >
            <Grid item>
              <QueryResponseTab />
            </Grid>
            <Grid item flex={1}>
              <OutputCard
                response={response}
                placeholder="Your response will appear here"
              />
            </Grid>
          </Grid>
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

function SplitView({ children, ...props }: ISplitViewProps) {
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

function Column({ children, ...props }: IColumnProps) {
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
      <T1Container>{children}</T1Container>
    </Grid>
  );
}

interface ICollapsibleExecuteQueryProps {
  contractAddress: string;
}

function CollapsibleExecuteQuery({
  contractAddress,
}: ICollapsibleExecuteQueryProps) {
  const theme = useTheme();
  const setResponse = useSetAtom(responseState);
  const [showExecuteQuery, setShowExecuteQuery] = useState(true);

  return (
    <Box sx={{ borderRadius: 1, overflow: "hidden", pb: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: theme.palette.common.black,
          color: theme.palette.common.white,
          cursor: "pointer",
          py: 0.5,
          px: 1,
        }}
        onClick={() => setShowExecuteQuery((curr) => !curr)}
      >
        <CollapsibleIcon expanded={showExecuteQuery} />
        <Typography sx={{ fontSize: "1.1rem" }}>Execute & Query</Typography>
      </Box>
      <Collapse in={showExecuteQuery}>
        <Box sx={{ height: 280 }}>
          <ExecuteQuery
            setResponse={setResponse}
            contractAddress={contractAddress!}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
