import { MenuItem } from "@mui/material";
import { useState } from "react";
import UploadModal from "../upload/UploadModal";
import CodeMenuItem from "./CodeMenuItem";
import T1MenuItem from "./T1MenuItem";
import { useAtomValue } from "jotai";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import simulationMetadataState, { Codes } from "../../atoms/simulationMetadataState";

interface ICodesMenuItemProps {
  chainId: string;
}

export default function CodesMenuItem(props: ICodesMenuItemProps) {
  const {chainId} = props;
  const {app} = useAtomValue(cwSimulateAppState);
  const {metadata} = useAtomValue(simulationMetadataState);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  //@ts-ignore
  const codesFromStore = app.store.getIn(["wasm", "codes"]).toObject();
  const codes = {} as Codes;
  for (const key of Object.keys(codesFromStore)) {
    const fileName = metadata.codes[parseInt(key)]?.name;
    if (fileName) {
      codes[parseInt(key)] = {codeId: parseInt(key), name: fileName};
    }
  }

  return (
    <>
      <T1MenuItem
        label="Codes"
        nodeId={'codes'}
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
