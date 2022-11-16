import { Grid, Button, Popover, TextField, Typography } from "@mui/material";
import React from "react";
import { useAtom } from "jotai";
import { compareStates } from "../../atoms/simulationPageAtoms";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useSimulation from "../../hooks/useSimulation";
import { useContractTrace } from "../../CWSimulationBridge";
import { useParams } from "react-router-dom";
import { useTheme } from "../../configs/theme";
import { extractState } from "./StateStepper";
interface IProps {
  currentActiveStep: number;
}
export const ComparePopup = ({ currentActiveStep }: IProps) => {
  const [_, setCompareStates] = useAtom(compareStates);
  const { instanceAddress: contractAddress } = useParams();
  const sim = useSimulation();
  const muiTheme = useTheme();
  const traces = useContractTrace(sim, contractAddress!);
  const [error, setError] = React.useState("");
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleDiffClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDiffClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const keyDownHandler = (e: any) => {
    if (e.key == "Enter") {
      const toCompareState = e.target.value;
      if (toCompareState > traces.length || toCompareState < 0) {
        setError("Invalid State");
        return;
      }

      setCompareStates({
        state1: extractState(
          traces[currentActiveStep].storeSnapshot,
          contractAddress!
        ),
        state2: extractState(
          traces[toCompareState - 1].storeSnapshot,
          contractAddress!
        ),
      });

      setError("");
      e.preventDefault();
    }
  };
  return (
    <Grid>
      <Button
        aria-describedby={id}
        onClick={handleDiffClick}
        sx={{ color: `${muiTheme.palette.text.primary}` }}
      >
        <MoreVertIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleDiffClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          "& .css-3bmhjh-MuiPaper-root-MuiPopover-paper": {
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 4px 4px",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6b5f5f",
          },
        }}
      >
        <Grid item sx={{ p: 1 }}>
          <TextField
            id="compare-states"
            label="Compare with other parent "
            variant="standard"
            onKeyPress={(e) => keyDownHandler(e)}
            sx={{
              "& .css-xchuf0-MuiInputBase-root-MuiInput-root:after": {
                borderBottom: "1px solid #6b5f5f",
              },
            }}
          />
        </Grid>
        {error && (
          <Typography variant="subtitle2" color="red" sx={{ p: 1 }}>
            {error}
          </Typography>
        )}
      </Popover>
    </Grid>
  );
};
