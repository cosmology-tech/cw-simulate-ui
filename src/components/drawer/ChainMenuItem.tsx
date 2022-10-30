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
                  nodeId={'config'}
                  link={'config'}/>
      <T1MenuItem label="State"
                  nodeId={'state'}
                  link={'state'}/>
      <T1MenuItem label="Accounts"
                  nodeId={'accounts'}
                  link={'accounts'}/>
      <CodesMenuItem chainId={chainId}/>
      <InstancesMenuItem chainId={chainId}/>
    </T1MenuItem>
  );
}
