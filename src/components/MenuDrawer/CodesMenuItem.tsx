import { useRecoilValue } from "recoil";
import filteredCodesByChainId from "../../selectors/filteredCodesByChainId";
import CodeMenuItem from "./CodeMenuItem";
import T1MenuItem from "./T1MenuItem";

export interface ICodesMenuItemProps {
  chainId: string;
}
export default function CodesMenuItem(props: ICodesMenuItemProps) {
  const {
    chainId,
  } = props;
  
  const codes = useRecoilValue(filteredCodesByChainId(chainId)).codes;
  
  return (
    <T1MenuItem
      label="Codes"
      nodeId="codes"
    >
      {codes.map(code => (
        <CodeMenuItem
          key={code.id}
          chainId={chainId}
          code={code}
        />
      ))}
    </T1MenuItem>
  )
}
