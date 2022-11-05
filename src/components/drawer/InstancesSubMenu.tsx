import { useAtomValue } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";

export interface IInstancesSubMenuProps {}

export default function InstancesSubMenu(props: IInstancesSubMenuProps) {
  const {app} = useAtomValue(cwSimulateAppState);
  // @ts-ignore
  const instances = app.store.getIn(["wasm", "contractStorage"])?.toArray().map(i => i[0]);
  
  return (
    <>
      <SubMenuHeader title="Instances" />
      {instances && instances.map((instance: string) => (
        <InstanceMenuItem
          key={instance}
          instance={instance}
        />
      ))}
    </>
  )
}

interface IInstanceMenuItemProps {
  instance: string;
}

function InstanceMenuItem({ instance }: IInstanceMenuItemProps) {
  // TODO: find contract name from instance
  return (
    <T1MenuItem
      label={instance}
      textEllipsis
      link={`/instances/${instance}`}
    />
  )
}
