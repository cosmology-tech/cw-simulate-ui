import { useSetAtom } from "jotai";
import SubMenuHeader from "./SubMenuHeader";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import React, { ChangeEvent, ReactNode, useState } from "react";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { defaults } from "../../configs/constants";
import { useNavigate } from "react-router-dom";
import { stepTraceState } from "../../atoms/simulationPageAtoms";
import useSimulation from "../../hooks/useSimulation";

export interface ISettingsSubMenuProps {
}

interface IChainConfigFormValues {
  chainId: string;
  bech32Prefix: string;
}

export default function SettingsSubMenu(props: ISettingsSubMenuProps) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const navigate = useNavigate();
  
  const [chainConfigFormValues, setChainConfigFormValues] = useState<IChainConfigFormValues>({} as IChainConfigFormValues);
  const [openResetSimulationDialog, setOpenResetSimulationDialog] = useState(false);
  const setStepTrace = useSetAtom(stepTraceState);
  
  const handleResetSimulation = (e: any) => {
    sim.recreate(defaults.chains.terra);
    setOpenResetSimulationDialog(false);
    navigate('/accounts');
  };
  setStepTrace(undefined);

  const handleSaveConfig = () => {
    const { chainId, bech32Prefix } = chainConfigFormValues;
    try {
      sim.updateChainConfig(chainId, bech32Prefix);
      setNotification("Chain config saved successfully");
    }
    catch (err: any) {
      console.error(err);
      setNotification("Something went wrong while reconfiguring chain.", {severity: 'error'});
    }
  };

  const handleOnChangeChainConfig = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setChainConfigFormValues({...chainConfigFormValues, [name]: value});
  }

  return (
    <>
      <SubMenuHeader title="Settings"/>
      <SettingSubMenu title="Chain Configuration">
        <TextField
          sx={{width: '90%'}}
          helperText="Chain ID"
          id="chainId"
          defaultValue={sim.chainId}
          variant="standard"
          name="chainId"
          onChange={handleOnChangeChainConfig}
        />
        <TextField
          sx={{width: '90%'}}
          helperText="Bech32 Prefix"
          id="bech32Prefix"
          variant="standard"
          name="bech32Prefix"
          defaultValue={sim.bech32Prefix}
          onChange={handleOnChangeChainConfig}
        />
        <Button sx={{width: '90%'}} onClick={handleSaveConfig} variant="contained">Save</Button>
      </SettingSubMenu>
      <SettingSubMenu title="Simulation">
        <Button
          sx={{width: '90%'}}
          variant="contained"
          onClick={() => setOpenResetSimulationDialog(true)}
        >
          Reset Simulation
        </Button>
        <ResetSimulationDialog
          open={openResetSimulationDialog}
          onClose={() => setOpenResetSimulationDialog(false)}
          onReset={handleResetSimulation}
        />
      </SettingSubMenu>
    </>
  )
}

interface IResetSimulationDialogProps {
  open: boolean;
  onClose: () => void;
  onReset: (e: any) => void;
}

const ResetSimulationDialog = (props: IResetSimulationDialogProps) => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Reset Simulation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to reset the simulation? This will clear all the accounts,
          instances and contracts.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button color={'error'} onClick={props.onReset}>Reset</Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ISettingSubMenuProps {
  children?: ReactNode;
  title: string;
}

export const SettingSubMenu = ({children, title}: ISettingSubMenuProps) => {
  return (
    <Box sx={{left: 8, top: 5, position: 'relative', mb: 2}}>
      <Typography sx={{mb: 2, fontWeight: 'bold'}}>{title}</Typography>
      {children}
    </Box>
  )
}
