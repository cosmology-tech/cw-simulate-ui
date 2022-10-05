import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { CWSimulateEnv } from "@terran-one/cw-simulate";
import { useAtom, useAtomValue } from "jotai";
import React, { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import cwSimulateEnvState from "../../atoms/cwSimulateEnvState";
import simulationMetadataState from "../../atoms/simulationMetadataState";
import { downloadJSON } from "../../utils/fileUtils";
import UploadModal from "../upload/UploadModal";
import T1MenuItem from "./T1MenuItem";

export interface ISimulationItemProps {
}

const SimulationMenuItem = React.memo((props: ISimulationItemProps) => {
  const simulationMetadata = useAtomValue(simulationMetadataState);
  const {env} = useAtomValue(cwSimulateEnvState);
  const [showClearSimulation, setShowClearSimulation] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const navigate = useNavigate();
  const handleOnItemClick = React.useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const json = {...env, 'simulationMetadata': simulationMetadata};
    downloadJSON(JSON.stringify(json, null, 2), "simulation.json");
  }, []);

  return (
    <T1MenuItem
      nodeId="simulation"
      label="Simulation"
      options={[
        <MenuItem key="download-simulation"
                  onClick={handleOnItemClick}
                  disabled={Object.keys(env.chains).length === 0}
        >
          Download
        </MenuItem>,
        <MenuItem key="upload-simulation"
                  onClick={() => setOpenUploadDialog(true)}>Upload</MenuItem>,
        <MenuItem key="clear-simulation"
                  onClick={() => {
                    setShowClearSimulation(true);
                  }}
                  disabled={Object.keys(env.chains).length === 0}>Clear</MenuItem>,
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
  open: boolean;

  onClose(): void;
}

function ClearSimulationDialog(props: IClearSimulationDialogProps) {
  const {...rest} = props;
  const [, setSimulateEnv] = useAtom(cwSimulateEnvState);
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
            setSimulateEnv({env: new CWSimulateEnv()});
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
