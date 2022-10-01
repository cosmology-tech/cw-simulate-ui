import React, { MouseEvent, useState } from "react";
import T1MenuItem from "./T1MenuItem";
import { downloadJSON } from "../../utils/fileUtils";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UploadModal from "../upload/UploadModal";
import simulationMetadataState, { SimulationMetadata } from "../../atoms/simulationMetadataState";
import { useAtom } from "jotai";

export interface ISimulationItemProps {
}

export interface ISimulationJSON {
  simulationMetadata: SimulationMetadata;
}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  const [simulationMetadata, setSimulationMetadata] = useAtom(simulationMetadataState);
  const [simulateEnv, setSimulateEnv] = useAtom(cwSimulateEnvState);
  const [showClearSimulation, setShowClearSimulation] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const navigate = useNavigate();
  const handleOnItemClick = React.useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const json = {...simulateEnv, 'simulationMetadata': simulationMetadata};
    downloadJSON(JSON.stringify(json, null, 2), "simulation.json");
  }, []);

  return (
    <T1MenuItem
      nodeId="simulation"
      label="Simulation"
      options={[
        <MenuItem key="download-simulation"
                  onClick={handleOnItemClick}>Download</MenuItem>,
        <MenuItem key="upload-simulation"
                  onClick={() => setOpenUploadDialog(true)}>Upload</MenuItem>,
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
            navigate('/chains');
          }}
          simulateEnv={setSimulateEnv}
        />,
        <UploadModal
          key={'simulation-upload-modal'}
          dropzoneText={"Click to upload a simulation file & drop a file here"}
          dropTitle={"Upload Simulation"}
          variant='simulation'
          chainId={"chainId"}
          open={openUploadDialog}
          onClose={() => {
            setOpenUploadDialog(false);
            close();
          }}/>
      ]}/>
  )
});

interface IClearSimulationDialogProps {
  simulateEnv: (env: any) => void;
  open: boolean;

  onClose(): void;
}

function ClearSimulationDialog(props: IClearSimulationDialogProps) {
  const {simulateEnv, ...rest} = props;

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
            simulateEnv({});
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
