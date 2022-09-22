import { Box, Popover, MenuItem } from "@mui/material";
import { RefObject, useCallback, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import simulationState from "../../atoms/simulationState";
import { useNotification } from "../../atoms/snackbarNotificationState";
import filteredChainsFromSimulationState from "../../selectors/filteredChainsFromSimulationState";
import filteredConfigsByChainId from "../../selectors/filteredConfigsByChainId";
import { ChainConfig, creatChainForSimulation } from "../../utils/setupSimulation";
import T1MenuItem from "./T1MenuItem";

export interface IChainsItemProps {
  
}

export default function ChainsItem(props: IChainsItemProps) {
  const param = useParams();
  
  const chains = useRecoilValue(filteredChainsFromSimulationState);
  const chainConfig = useRecoilValue(filteredConfigsByChainId(param.id!));
  const chainNames = chains
    .map(({chainId}) => chainId)
    .sort((lhs, rhs) => lhs.localeCompare(rhs));
  const [showAddChain, setShowAddChain] = useState(false);
  const setSimulation = useSetRecoilState(simulationState);
  const setNotification = useNotification();
  
  const [menuEl, setMenuEl] = useState<HTMLUListElement | null>(null);
  
  const handleAddChain = useCallback(() => {
    setShowAddChain(true);
  }, []);

  const addChain = useCallback(
    (chainName: string) => {
      setShowAddChain(false);
      if (chainNames.includes(chainName)) {
        setNotification("A chain with such a name already exists", { severity: "error" });
        return;
      }

      setSimulation(prev => ({
        ...prev,
        simulation: {
          ...prev.simulation,
          chains: [
            ...prev.simulation.chains,
            {
              chainId: chainName,
              bech32Prefix: "terra",
              accounts: [
                {
                  id: "alice",
                  address: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
                  balance: 100000000,
                },
              ],
              codes: [],
              states: [],
            },
          ],
        },
      }));

      creatChainForSimulation(window.CWEnv, {
        chainId: chainName,
        bech32Prefix: "terra",
      } as ChainConfig);
    },
    [chainConfig]
  );
  
  return (
    <T1MenuItem
      nodeId="chains"
      label="Chains"
      menuRef={setMenuEl}
      options={[
        <MenuItem key="add-chain" onClick={handleAddChain}>Add Chain</MenuItem>
      ]}
      optionsExtras={[
        <AddChainPopover
          key="add-chain"
          open={showAddChain}
          menuRef={menuEl}
          onClose={() => {setShowAddChain(false)}}
        />
      ]}
    >
      {chainNames.map(chain => (
        <T1MenuItem key={chain} nodeId={`chains/${chain}`} label={chain} />
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
  
  return (
    <Popover
      open={open}
      anchorEl={anchor}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      onClose={onClose}
      sx={{ ml: 0.5 }}
    >
      <Box sx={{ p: 1 }}>
        foobar
      </Box>
    </Popover>
  )
}

function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains?.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}
