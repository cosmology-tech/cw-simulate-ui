import { CWContractInstance } from "@terran-one/cw-simulate";
import T1MenuItem from "./T1MenuItem";

export interface IInstanceMenuItemProps {
  chainId: string;
  instance: CWContractInstance;
}

export default function InstanceMenuItem(props: IInstanceMenuItemProps) {
  const {
    chainId,
    instance,
  } = props;
  
  return (
    <T1MenuItem
      label={instance.contractAddress}
      nodeId={`${chainId}/instances/${instance.contractAddress}`}
      link={`/chains/${chainId}#codes`}
      textEllipsis
    />
  )
}
