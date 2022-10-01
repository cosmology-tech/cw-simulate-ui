import { MenuItem } from "@mui/material";
import { useState } from "react";
import { selectCodesMetadata } from "../../atoms/simulationMetadataState";
import UploadModal from "../upload/UploadModal";
import CodeMenuItem from "./CodeMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useAtomValue } from "jotai";

interface ICodesMenuItemProps {
  chainId: string;
}

export default function CodesMenuItem(props: ICodesMenuItemProps) {
  const {chainId} = props;
  const codes = useAtomValue(selectCodesMetadata(chainId));

  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  return (
    <>
      <T1MenuItem
        label="Codes"
        nodeId={`${chainId}/codes`}
        options={[
          <MenuItem
            key="upload-contract"
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload new contract
          </MenuItem>
        ]}
        optionsExtras={({close}) => [
          <UploadModal
            key="contract-upload-modal-for-sidebar"
            chainId={chainId}
            open={openUploadDialog}
            onClose={() => {
              setOpenUploadDialog(false);
              close();
            }}
            variant={'contract'}
          />
        ]}
      >
        {Object.values(codes).map((code) => (
          <CodeMenuItem key={code.codeId} chainId={chainId} code={code}/>
        ))}
      </T1MenuItem>
    </>
  );
}
