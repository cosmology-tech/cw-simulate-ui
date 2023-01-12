import { cx } from "@emotion/css";
import { useSetAtom } from "jotai";
import React, { ChangeEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { lastChainIdState, stepTraceState } from "../../atoms/simulationPageAtoms";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { defaults } from "../../configs/constants";
import { isValidSession, useSession } from "../../hooks/useSession";
import useSimulation from "../../hooks/useSimulation";
import type { StyleProps } from "../../utils/typeUtils";
import { joinSx } from "../../utils/reactUtils";
import SubMenuHeader from "./SubMenuHeader";

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
  const session = useSession();
  
  const [chainConfigFormValues, setChainConfigFormValues] = useState<IChainConfigFormValues>({
    chainId: sim.chainId,
    bech32Prefix: sim.bech32Prefix,
  });
  const [openResetSimulationDialog, setOpenResetSimulationDialog] = useState(false);
  const setStepTrace = useSetAtom(stepTraceState);
  const setLastChainId = useSetAtom(lastChainIdState);
  
  const handleResetSimulation = async () => {
    setNotification('Deleting session...', { severity: 'info' });
    
    // session & state cleanup
    isValidSession(session) && await session.clear(sim.chainId);
    sim.recreate(defaults.chains.terra);
    setLastChainId('');
    delete localStorage['lastChainId'];
    
    // UI cleanup
    setOpenResetSimulationDialog(false);
    navigate('/');
    
    setNotification('Session has been reset.');
  };
  setStepTrace(undefined);

  const handleSaveConfig = () => {
    const { chainId, bech32Prefix } = chainConfigFormValues;
    if (!chainId.trim() || !bech32Prefix.trim()) {
      setNotification("Both Chain ID & Bech32 Prefix must be set", { severity: "error" });
      return;
    }
    
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
          helperText="Chain ID"
          id="chainId"
          defaultValue={sim.chainId}
          variant="standard"
          name="chainId"
          onChange={handleOnChangeChainConfig}
        />
        <TextField
          helperText="Bech32 Prefix"
          id="bech32Prefix"
          variant="standard"
          name="bech32Prefix"
          defaultValue={sim.bech32Prefix}
          onChange={handleOnChangeChainConfig}
        />
        <Button
          variant="contained"
          disabled={!isConfigValid(chainConfigFormValues)}
          onClick={handleSaveConfig}
        >
          Save
        </Button>
      </SettingSubMenu>
      <SettingSubMenu title="Simulation">
        <Button
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
  onClose(): void;
  onReset(): void;
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
        <Button color="error" onClick={props.onReset}>Reset</Button>
      </DialogActions>
    </Dialog>
  );
}

export type SettingSubMenuProps = StyleProps & {
  children?: ReactNode;
  title: string;
}

export const SettingSubMenu = ({ children, title, sx, className }: SettingSubMenuProps) => {
  return (
    <Box
      sx={joinSx({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        p: 1,
        mb: 2,
      }, sx)}
      className={cx('T1SettingSubMenu', className)}
    >
      <Typography fontWeight='bold' mb={2}>{title}</Typography>
      {children}
    </Box>
  )
}

function isConfigValid(values: IChainConfigFormValues): boolean {
  const { chainId, bech32Prefix } = values;
  return !!chainId.trim() && !!bech32Prefix.trim();
}
