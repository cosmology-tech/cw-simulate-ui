import {
  Grid,
  Button,
  Popover,
  TextField,
  Typography,
  Autocomplete,
  AutocompleteRenderInputParams,
} from "@mui/material";
import React, { useState } from "react";
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
  const [compareWith, setCompareWith] = useState<string>();
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
  const onChangeHandler = (value: string) => {
    const toCompareState = Number(value);
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
    setCompareWith(value);
    setError("");
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
          "& .MuiPopover-paper ": {
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 4px 4px !important",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6b5f5f",
          },
        }}
      >
        <Grid item sx={{ p: 1 }}>
          <Autocomplete
            onInputChange={(_, value) =>
              value.length > 0 && onChangeHandler(value)
            }
            sx={{
              width: "10vw",
            }}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <TextField
                {...params}
                label="Compare with other parent"
                sx={{
                  "&  .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6b5f5f !important",
                  },
                }}
              />
            )}
            options={[
              ...[...Array(traces.length + 1).keys()]
                .filter((ele) => ele !== currentActiveStep + 1 && ele !== 0)
                .map((ele) => `${ele}`),
            ]}
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
