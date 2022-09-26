import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Divider,
  Grid,
  Paper,
  Slide,
  StepContent,
  StepLabel,
  Typography,
  Zoom,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { JSONTree } from "react-json-tree";
import { executionHistory } from "../../data/dummy";
// import { executionHistory } from "../../data/test";

const steps = [
  "Instantiate",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
  "Execute",
];

const theme = {
  scheme: "chalk",
  author: "chris kempson (http://chriskempson.com)",
  base00: "#FFFFFF",
  base01: "#202020",
  base02: "#303030",
  base03: "#505050",
  base04: "#b0b0b0",
  base05: "#d0d0d0",
  base06: "#e0e0e0",
  base07: "#f5f5f5",
  base08: "#fb9fb1",
  base09: "#eda987",
  base0A: "#ddb26f",
  base0B: "#acc267",
  base0C: "#12cfc0",
  base0D: "#6fc2ef",
  base0E: "#e1a3ee",
  base0F: "#deaf8f",
};

export default function StateStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef();
  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };
  // const { request, response } = executionHistory[0];
  return (
    <Stepper nonLinear activeStep={activeStep} orientation="vertical">
      {executionHistory.map((historyObj: {request: any, response: any}, index) => {
        const { request, response } = historyObj;
        const label = Object.keys(request)[2];
        return (
          <Step key={`${label}${index}`} onClick={handleStep(index)}>
            <StepLabel ref={containerRef}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {activeStep === index && isOpen ? (
                  <ArrowDropDownIcon onClick={() => setIsOpen(false)} />
                ) : (
                  <ArrowRightIcon onClick={() => setIsOpen(true)} />
                )}
                {label}
              </div>
            </StepLabel>
            <StepContent>
              {activeStep === index && isOpen && (
                <Slide
                  direction="down"
                  in={true}
                  container={containerRef.current}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      height: "30vh",
                      overflow: "scroll",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      borderTop: "1px solid rgb(0, 0, 0, 0.12)",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "scroll",
                        mb: 1,
                      }}
                    >
                      <div style={{ position: "sticky", top: 0 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "sticky",
                          }}
                        >
                          Request
                        </Typography>
                        <Divider orientation="horizontal" />
                      </div>
                      <div style={{ overflow: "scroll" }}>
                        <JSONTree
                          data={request}
                          theme={theme}
                          invertTheme={false}
                        />
                      </div>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "scroll",
                        position: "relative",
                      }}
                    >
                      <div style={{ position: "sticky", top: 0 }}>
                        <Divider orientation="horizontal" />
                        <Typography
                          variant="caption"
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          Response
                        </Typography>
                        <Divider orientation="horizontal" />
                      </div>
                      <div style={{ overflow: "scroll" }}>
                        <JSONTree
                          data={response}
                          theme={theme}
                          invertTheme={false}
                        />
                      </div>
                    </Grid>
                  </Paper>
                </Slide>
              )}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
}