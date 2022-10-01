import { Box, Button, Divider, Input, MenuItem, Popover, Typography } from "@mui/material";
import { RefObject, useCallback, useRef, useState } from "react";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { useCreateChainForSimulation } from "../../utils/setupSimulation";
import { getDefaultChainName, isValidChainName, useChainNames } from "../../utils/simUtils";
import ChainMenuItem from "./ChainMenuItem";
import T1MenuItem from "./T1MenuItem";

export interface IChainsItemProps {

}

export default function ChainsMenuItem(props: IChainsItemProps) {
  const chainNames = useChainNames(true);
  const [showAddChain, setShowAddChain] = useState(false);

  const [menuEl, setMenuEl] = useState<HTMLUListElement | null>(null);

  return (
    <T1MenuItem
      nodeId="chains"
      label="Chains"
      menuRef={setMenuEl}
      options={[
        <MenuItem key="add-chain" onClick={() => {
          setShowAddChain(true)
        }}>Add Chain</MenuItem>
      ]}
      optionsExtras={({close}) => [
        <AddChainPopover
          key="add-chain"
          open={showAddChain}
          menuRef={menuEl}
          onClose={() => {
            setShowAddChain(false);
            close();
          }}
        />
      ]}
    >
      {chainNames.map((chain, i) => (
        <ChainMenuItem chainId={chain} key={`chain${i}`}/>
      ))}
    </T1MenuItem>
  )
}

interface IAddChainPopoverProps {
  open: boolean;
  menuRef: HTMLUListElement | RefObject<HTMLUListElement> | null;

  onClose(): void;
}

function AddChainPopover(props: IAddChainPopoverProps) {
  const {
    open,
    menuRef: anchorRef,
    onClose,
  } = props;

  const anchor = anchorRef
    ? ('current' in anchorRef ? anchorRef.current : anchorRef)
    : null;

  const chainNames = useChainNames();
  const setNotification = useNotification();
  const createChain = useCreateChainForSimulation();

  const inputRef = useRef<HTMLInputElement>(null);

  const addChain = useCallback(() => {
    const chainName = inputRef.current?.value;
    if (!chainName || !isValidChainName(chainName)) {
      setNotification("Please specify a valid chain name.", {severity: "error"});
      return;
    }

    if (chainNames.includes(chainName)) {
      setNotification("A chain with such a name already exists", {severity: "error"});
      return;
    }

    createChain({
      chainId: chainName,
      bech32Prefix: 'terra',
    });

    onClose();
  }, [chainNames, createChain, onClose, setNotification]);

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      transformOrigin={{horizontal: 'left', vertical: 'top'}}
      onClose={onClose}
      sx={{ml: 0.5}}
    >
      <Box sx={{display: 'flex', flexDirection: 'column', p: 1, maxWidth: 460}}>
        <Typography variant="h6" sx={{textAlign: 'center'}}>
          Add a new Chain
        </Typography>
        <Divider/>
        <Typography variant="overline">
          Enter a valid chain name, e.g. "phoenix-1" or "osmosis-1":
        </Typography>
        <Input
          inputRef={inputRef}
          defaultValue={getDefaultChainName(chainNames)}
          sx={{mb: 1}}
        />
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button onClick={addChain}>Submit</Button>
        </Box>
      </Box>
    </Popover>
  )
}
