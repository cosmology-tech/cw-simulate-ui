import { useRecoilValue } from "recoil";
import { selectCodesMeta } from "../../atoms/simulationMetadataState";
import CodeMenuItem from "./CodeMenuItem";
import T1MenuItem from "./T1MenuItem";

export interface ICodesMenuItemProps {
  chainId: string;
}
export default function CodesMenuItem(props: ICodesMenuItemProps) {

  const {
    chainId,
  } = props;

  const codes = useRecoilValue(selectCodesMeta(chainId));

  return (
    <T1MenuItem
      label="Codes"
      nodeId={`${chainId}/codes`}
      link={`/chains/${chainId}#codes`}
    >
      {Object.values(codes).map((code) => (
        <CodeMenuItem key={code.codeId} chainId={chainId} code={code} />
      ))}
    </T1MenuItem>
  );
}
