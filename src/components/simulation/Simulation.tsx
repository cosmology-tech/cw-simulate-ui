import {
  Divider,
  Grid,
  Paper,
  styled,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
} from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import React, { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import { responseState } from "../../atoms/reponseState";
import type { GridSizeProps } from "../../utils/typeUtils";
import { StateRenderer } from "./StateRenderer";
import StateStepper from "./StateStepper";
import { ExecuteQuery } from "./ExecuteQuery";
import { GREY_6 } from "../../configs/variables";
import { OutputCard } from "./OutputCard";
import T1Container from "../grid/T1Container";
import Widget from "./Widget";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

const Simulation = () => {
  const [response, setResponse] = useAtom(responseState);
  const isFileUploaded = useAtomValue(fileUploadedState);

  const { chainId, instanceAddress: contractAddress } = useParams();

  return (
    <SplitView className="T1Simulation-root">
      <Widget size={6}>
        <Row xs={12}>
          <Grid
            item
            xs={12}
            sx={{
              height: "10%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                width: "100%",
                background: "#cec6c6",
                textAlign: "center",
                borderRadius: "2px",
              }}
            >
              SEND MESSAGE
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "90%",
            }}
          >
            <Row xs={6}>
              <ExecuteQuery
                setResponse={setResponse}
                chainId={chainId!}
                contractAddress={contractAddress!}
              />
            </Row>
            <Row xs={6}>
              <Grid
                item
                container
                direction="column"
                flexWrap="nowrap"
                sx={{
                  height: "100%",
                  gap: 2,
                }}
              >
                <Grid item flexShrink={0}>
                  <Tabs value="response" aria-label="Response tab">
                    <Tab value="response" label="Response" />
                  </Tabs>
                </Grid>
                <Grid item flex={1} position="relative">
                  <T1Container>
                    <OutputCard
                      placeholder="Your Execute/Query response will appear here."
                      response={response}
                    />
                  </T1Container>
                </Grid>
              </Grid>
            </Row>
          </Grid>
        </Row>
      </Widget>
      <Widget size={6}>
        <Row xs={12}>
          <Grid
            item
            xs={12}
            sx={{
              height: "10%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                width: "100%",
                background: "#cec6c6",
                textAlign: "center",
                borderRadius: "2px",
              }}
            >
              HISTORY
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "90%",
            }}
          >
            <Row xs={4}>
              <StateStepper
                chainId={chainId!}
                contractAddress={contractAddress!}
              />
            </Row>
            <Row xs={8}>
              <StateRenderer isFileUploaded={isFileUploaded} />
            </Row>
          </Grid>
        </Row>
      </Widget>
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
      direction="column"
      spacing={2}
      sx={{
        height: "100%",
        width: "100%",
      }}
      {...props}
    >
      {children}
    </Grid>
  );
}

interface IRowProps extends GridSizeProps {
  children?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

function Row({ children, ...props }: IRowProps) {
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
        direction="row"
        component={StyledPaper}
        sx={{
          height: "100%",
          overflow: "auto",
          "> .T1Widget-root:not(:first-of-type)": {
            borderTop: `1px solid ${GREY_6}`,
          },
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
}
