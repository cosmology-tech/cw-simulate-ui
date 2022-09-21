import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Paper, StepContent, StepLabel, Zoom } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { JSONTree } from "react-json-tree";
import { data } from "../../data/dummy";

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
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <Stepper
      nonLinear
      activeStep={activeStep}
      orientation="vertical"
      sx={{ height: "40vh" }}
    >
      {steps.map((label, index) => (
        <Step key={label} onClick={handleStep(index)}>
          <StepLabel>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {activeStep === index ? (
                <ArrowDropDownIcon />
              ) : (
                <ArrowRightIcon />
              )}
              {label}
            </div>
          </StepLabel>
          <StepContent>
            {activeStep === index && (
              <Zoom in={true} style={{ transitionDelay: "520ms" }}>
                <Paper
                  elevation={3}
                  sx={{
                    height: "14vh",
                    overflow: "scroll",
                    textAlign: "left",
                  }}
                >
                  <JSONTree data={data} theme={theme} invertTheme={false} />
                </Paper>
              </Zoom>
            )}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
