import {
  Grid,
  Typography,
} from "@mui/material";
import { useAtomValue } from "jotai";
import React from "react";
import Widget from "./Widget";
import Row from "./Row";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import { StateRenderer } from "./StateRenderer";
import StateStepper from "./StateStepper";

interface IHistoryProps {
  chainId: string;
  contractAddress: string
}

export default function({ chainId, contractAddress }: IHistoryProps) {
  const isFileUploaded = useAtomValue(fileUploadedState);

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
  );
}