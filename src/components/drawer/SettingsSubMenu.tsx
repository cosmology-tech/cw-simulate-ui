import { useAtomValue } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import SubMenuHeader from "./SubMenuHeader";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  Input,
  Typography
} from "@mui/material";
import { ReactNode } from "react";

export interface ISettingsSubMenuProps {
}

export default function SettingsSubMenu(props: ISettingsSubMenuProps) {
  const {app} = useAtomValue(cwSimulateAppState);

  const handleResetSimulation = () => {
    // TODO: Show dialog to confirm then reset the simulation
  }

  const handleSaveConfig = () => {
    //TODO: save config
  }

  return (
    <>
      <SubMenuHeader title="Settings"/>
      <SettingSubMenu title={'Chain Configuration'}>
        <FormControl sx={{width: '90%'}}>
          <FormGroup>
            <Input id="chainId" aria-describedby="chainIdHelperText" defaultValue={app.chainId}/>
            <FormHelperText id="chainIdHelperText">Chain Id</FormHelperText>

            <Input id="bech32Prefix" aria-describedby="bech32PrefixHelperText"
                   defaultValue={app.bech32Prefix}/>
            <FormHelperText id="bech32PrefixHelperText">Bech32 Prefix</FormHelperText>

            <Button variant={'contained'} onClick={() => handleSaveConfig}>Save</Button>
          </FormGroup>
        </FormControl>
      </SettingSubMenu>
      <SettingSubMenu title={'Simulation'}>
        <Button sx={{width: '90%'}} variant={'contained'}
                onClick={() => handleResetSimulation}>
          Reset Simulation
        </Button>
      </SettingSubMenu>
    </>
  )
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
