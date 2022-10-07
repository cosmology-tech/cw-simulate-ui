import { Grid, Button, Popover, TextField } from "@mui/material";
import DifferenceOutlinedIcon from "@mui/icons-material/DifferenceOutlined";
import React from "react";
import { useAtom } from "jotai";
import { compareStates } from "../../atoms/compareStates";
import { stateResponseTabState } from "../../atoms/stateResponseTabState";

interface IProps {
  currentActiveState: number;
  executionHistory: any;
}
export const ComparePopup = ({
  currentActiveState,
  executionHistory,
}: IProps) => {
  const [_, setCompareStates] = useAtom(compareStates);
  const [__, setStateResponseTab] = useAtom(stateResponseTabState);
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);
  const handleDiffClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDiffClose = () => {
    setAnchorEl(null);
  };
  const getStateString = (stateObj: any) => {
    return window.atob(stateObj?.dict._root.entries[0][1]);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const keyDownHandler = (e: any) => {
    if (e.key == "Enter") {
      console.log("value", e.target.value);
      setCompareStates({
        state1: getStateString(executionHistory[currentActiveState].state),
        state2: getStateString(executionHistory[e.target.value - 1].state),
      });
      setStateResponseTab("state");
      e.preventDefault();
    }
  };
  return (
    <Grid>
      <Button aria-describedby={id} onClick={handleDiffClick}>
        <DifferenceOutlinedIcon sx={{ height: "0.8em" }} />
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
        }}
      >
        <Grid item sx={{ p: 1 }}>
          <TextField
            id="compare-states"
            label="Compare with State number"
            variant="standard"
            onKeyPress={(e) => keyDownHandler(e)}
          />
        </Grid>
      </Popover>
    </Grid>
  );
};
