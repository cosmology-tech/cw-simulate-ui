import {
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import React from "react";
import { responseState } from "../../atoms/reponseState";
import { ExecuteQuery } from "./ExecuteQuery";
import { OutputCard } from "./OutputCard";
import T1Container from "../grid/T1Container";
import Widget from "./Widget";
import Row from "./Row";

interface ISendMessageProps {
  chainId: string;
  contractAddress: string
}

export default function({ chainId, contractAddress }: ISendMessageProps) {
  const [response, setResponse] = useAtom(responseState);

  return (
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
              chainId={chainId}
              contractAddress={contractAddress}
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
  );
}
