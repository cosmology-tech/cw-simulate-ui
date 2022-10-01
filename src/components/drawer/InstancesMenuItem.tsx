import filteredInstancesFromChainId from "../../selectors/filteredInstancesFromChainId";
import InstanceMenuItem from "./InstanceMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useAtomValue } from "jotai";

export interface IInstancesMenuItemProps {
  chainId: string;
}

export default function InstancesMenuItem(props: IInstancesMenuItemProps) {
  const {chainId} = props;

  const instances = useAtomValue(filteredInstancesFromChainId(chainId));
  if (!instances.length) {
    return <></>
  }

  return (
    <T1MenuItem
      label="Instances"
      nodeId={`${chainId}/instances`}
      link={`/chains/${chainId}/codes`}
    >
      {instances.map(instance => (
        <InstanceMenuItem
          key={instance.contractAddress}
          chainId={chainId}
          instance={instance}
        />
      ))}
    </T1MenuItem>
  )
}
