import React, { MouseEvent, useState } from "react";
import T1MenuItem from "./T1MenuItem";
import { downloadJSON } from "../../utils/fileUtils";
import { useRecoilState } from "recoil";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface ISimulationItemProps {
}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  const [simulationEnv, setSimulationEnv] = useRecoilState(cwSimulateEnvState);
  const [showClearSimulation, setShowClearSimulation] = useState(false);
  const navigate = useNavigate();
  const handleOnItemClick = React.useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadJSON(JSON.stringify(simulationEnv, null, 2), "simulation.json");
  }, []);
  return (
    <T1MenuItem
      nodeId="simulation"
      label="Simulation"
      options={[
        <MenuItem key="download-simulation"
                  onClick={handleOnItemClick}>Download</MenuItem>,
        <MenuItem key="upload-simulation"
                  onClick={handleOnItemClick}>Upload</MenuItem>,
        <MenuItem key="clear-simulation"
                  onClick={() => {
                    setShowClearSimulation(true);
                  }}>Clear</MenuItem>,
      ]}
      optionsExtras={({close}) => [
        <ClearSimulationDialog
          key="clear-simulation"
          open={showClearSimulation}
          onClose={() => {
            setShowClearSimulation(false);
            close();
            navigate('/');
          }}
          setSimulationEnv={setSimulationEnv}
        />,
      ]}/>
  )
});

interface IClearSimulationDialogProps {
  setSimulationEnv: (env: any) => void;
  open: boolean;

  onClose(): void;
}

function ClearSimulationDialog(props: IClearSimulationDialogProps) {
  const {setSimulationEnv, ...rest} = props;

  return (
    <Dialog {...rest}>
      <DialogTitle>Confirm Clear Simulation</DialogTitle>
      <DialogContent>
        Are you absolutely certain you wish to clear simulation?
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            rest.onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setSimulationEnv({});
            rest.onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SimulationMenuItem;
