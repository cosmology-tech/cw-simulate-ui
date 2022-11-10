import { useAtom } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
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
import { CWSimulateApp } from "@terran-one/cw-simulate";
import { TerraConfig } from "../../configs/constants";

export interface ISettingsSubMenuProps {
}

interface IChainConfigFormValues {
  chainId: string;
  bech32Prefix: string;
}

export default function SettingsSubMenu(props: ISettingsSubMenuProps) {
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const [chainConfigFormValues, setChainConfigFormValues] = useState<IChainConfigFormValues>({} as IChainConfigFormValues);
  const setNotification = useNotification();
  const [openResetSimulationDialog, setOpenResetSimulationDialog] = useState(false);
  const handleResetSimulation = (e: any) => {
    setSimulateApp({
      app: new CWSimulateApp(TerraConfig)
    });
    setOpenResetSimulationDialog(false);
  };

  const handleSaveConfig = () => {
    app.chainId = chainConfigFormValues.chainId;
    app.bech32Prefix = chainConfigFormValues.bech32Prefix;
    setSimulateApp({app});
    setNotification("Chain config saved successfully");
  };

  const handleOnChangeChainConfig = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setChainConfigFormValues({...chainConfigFormValues, [name]: value});
  }

  const handleClose = () => {
    setOpenResetSimulationDialog(false);
  };

  return (
    <>
      <SubMenuHeader title="Settings"/>
      <SettingSubMenu title={'Chain Configuration'}>
        <TextField sx={{width: '90%'}} helperText={'Chain Id'}
                   id="chainId"
                   defaultValue={app.chainId}
                   variant={'standard'}
                   name={'chainId'}
                   onChange={handleOnChangeChainConfig}/>
        <TextField sx={{width: '90%'}} helperText={'Bech32 Prefix'}
                   id="bech32Prefix"
                   variant={'standard'}
                   name={'bech32Prefix'}
                   defaultValue={app.bech32Prefix}
                   onChange={handleOnChangeChainConfig}/>
        <Button sx={{width: '90%'}} onClick={handleSaveConfig} variant={'contained'}>Save</Button>
      </SettingSubMenu>
      <SettingSubMenu title={'Simulation'}>
        <Button sx={{width: '90%'}} variant={'contained'}
                onClick={() => setOpenResetSimulationDialog(true)}>
          Reset Simulation
        </Button>
        <ResetSimulationDialog open={openResetSimulationDialog}
                               onClose={() => setOpenResetSimulationDialog(false)}
                               onReset={handleResetSimulation}/>
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
