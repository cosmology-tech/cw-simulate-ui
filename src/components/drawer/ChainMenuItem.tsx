import CodesMenuItem from "./CodesMenuItem";
import InstancesMenuItem from "./InstancesMenuItem";
import T1MenuItem from "./T1MenuItem";

export interface IChainMenuItemProps {
  chainId: string;
}

export default function ChainMenuItem(props: IChainMenuItemProps) {
  const {chainId} = props;

  return (
    <T1MenuItem
      key={chainId}
      nodeId={`chains/${chainId}`}
      label={chainId}
    >
      <T1MenuItem label="Config"
                  nodeId={`chains/${chainId}/config`}
                  link={`/chains/${chainId}/config`}/>
      <T1MenuItem label="State"
                  nodeId={`chains/${chainId}/state`}
                  link={`/chains/${chainId}/state`}/>
      <T1MenuItem label="Accounts"
                  nodeId={`chains/${chainId}/accounts`}
                  link={`/chains/${chainId}/accounts`}/>
      <CodesMenuItem chainId={chainId}/>
      <InstancesMenuItem chainId={chainId}/>
    </T1MenuItem>
  );
}
