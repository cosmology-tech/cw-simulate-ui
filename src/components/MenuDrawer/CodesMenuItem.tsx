import { useMemo } from "react";
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
  
  const codes = useCodes(chainId, true);
  
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

function useCodes(chainId: string, sorted = false) {
  const codes = useRecoilValue(filteredCodesByChainId(chainId)).codes;
  return useMemo(() => {
    return sorted
      ? [...codes].sort((lhs, rhs) => lhs.id.localeCompare(rhs.id))
      : codes;
  }, [codes]);
}
