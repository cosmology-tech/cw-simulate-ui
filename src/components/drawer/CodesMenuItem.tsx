import { MenuItem } from "@mui/material";
import { useState } from "react";
import UploadModal from "../upload/UploadModal";
import CodeMenuItem from "./CodeMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useAtomValue } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";

interface ICodesMenuItemProps {
  chainId: string;
}

interface Code {
  codeId: number,
  name: string,
}

interface Codes {
  [key: number]: Code;
}

export default function CodesMenuItem(props: ICodesMenuItemProps) {
  const {chainId} = props;
  const {app} = useAtomValue(cwSimulateAppState);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  //@ts-ignore
  const codesFromStore = app.store.getIn(["wasm", "codes"]).toObject();
  const codes = {} as Codes;
  for (const key of Object.keys(codesFromStore)) {
    codes[parseInt(key)] = {codeId: parseInt(key), name: key};
  }

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
          <CodeMenuItem key={code?.codeId} chainId={chainId} code={code}/>
        ))}
      </T1MenuItem>
    </>
  );
}
