import React, { Suspense } from "react";
import { Box, CircularProgress, SnackbarProps } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fileUploadedState } from "../atoms/fileUploadedState";
import simulationMetaState from "../atoms/simulationMetaState";
import { useNotification } from "../atoms/snackbarNotificationState";
import { base64ToArrayBuffer } from "../utils/fileUtils";
import { useCreateChainForSimulation, useStoreCode } from "../utils/setupSimulation";
import { getDefaultChainName } from "../utils/simUtils";
import filteredChainsFromSimulationState from "../selectors/filteredChainsFromSimulationState";

const DropzoneArea = React.lazy(async () => ({default: (await import('react-mui-dropzone')).DropzoneArea}))

interface IProps {
  dropzoneText?: string;
  fileTypes: string[];
  /** Optional chain ID. If none specified, creates a new untitled chain. */
  chainId?: string;
}

const FileUpload = ({
  dropzoneText,
  fileTypes,
  chainId,
}: IProps) => {
  const setIsFileUploaded = useSetRecoilState(fileUploadedState);
  const setSimulationMeta = useSetRecoilState(simulationMetaState);
  const chains = useRecoilValue(filteredChainsFromSimulationState) ?? {};
  const createChain = useCreateChainForSimulation();
  const storeCode = useStoreCode();
  const snackbarProps: SnackbarProps = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  };
  
  const text = dropzoneText || "Click to upload a simulation file or contract binary or Drag & drop a file here";
  const setNotification = useNotification();

  const handleOnFileDrop = (files: File[]) => {
    // Only allow one file to be uploaded
    const file: File = files[0];
    fileTypes?.forEach((fileType: string) => {
        if (file.type === "application/wasm") {
          let _chainId = chainId ?? '';
          const reader = new FileReader();
          reader.readAsDataURL(file);
          
          if (!_chainId) {
            _chainId = getDefaultChainName(Object.keys(chains));
            createChain({
              chainId: _chainId,
              bech32Prefix: 'terra',
            });
          }
          
          reader.onload = () => {
            const contents = reader.result;
            if (!contents) {
              setNotification("Failed to extract bytecode", { severity: "error" });
              return;
            }
            
            let codeId: number;
            try {
              const buffer = Buffer.from(extractByteCode(contents));
              codeId = storeCode(_chainId, file.name, buffer);
            }
            catch (ex: any) {
              setNotification(`Failed to extract & store WASM bytecode: ${ex.message ?? ex}`, { severity: "error" });
              console.error(ex);
              return;
            }
            
            setSimulationMeta(prev => {
              const meta = prev[_chainId];
              
              return {
                ...prev,
                [_chainId]: {
                  ...meta,
                  codes: {
                    ...meta.codes,
                    [file.name]: {
                      name: file.name,
                      codeId,
                    },
                  },
                },
              };
            });
            setIsFileUploaded(true);
          }

          reader.onerror = () => {
            setNotification("Error reading WASM binary file", { severity: "error" });
          }
        }

        else if (file.type === "application/json") {
          setNotification("Simulation upload is currently not supported.", { severity: "error" });
          // const reader = new FileReader();
          // reader.readAsText(file);
          // reader.onload = () => {
          //   // TODO: confirmation prompt if simulation is already loaded b/c we're about to override that
          //   const json = JSON.parse(reader.result as string)
          //   if (validateSimulationJSON(json)) {
          //     setSimulation(json);
          //     setIsFileUploaded(true);
          //   } else {
          //     // TODO: Add error message when JSON is invalid
          //   }
          // };

          // reader.onerror = () => {
          //   setNotification("Error reading simulation file", { severity: "error" });
          // }
        }
      }
    )
    ;
  };

  const handleOnFileChange = (files: File[]) => {
    if (files.length === 0) {
      setIsFileUploaded(false);
    }
  };

  const handleOnFileDelete = (file: File) => {
    // TODO: clear local storage and CWEnv
  };

  return (
    <Suspense fallback={<Fallback/>}>
      <DropzoneArea
        dropzoneClass="dropzone"
        acceptedFiles={fileTypes}
        showFileNames={true}
        dropzoneText={text}
        onDrop={handleOnFileDrop}
        onDelete={handleOnFileDelete}
        alertSnackbarProps={snackbarProps}
        onChange={handleOnFileChange}
        filesLimit={1}
      />
    </Suspense>
  );
};

function Fallback() {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250}}>
      <CircularProgress/>
    </Box>
  )
}

export default FileUpload;

function extractByteCode(contents: string | ArrayBuffer): ArrayBuffer {
  if (typeof contents !== 'string')
    return contents;
  const prefix = 'data:application/wasm;base64,';
  if (!contents.startsWith(prefix))
    throw new Error(`Malformed WASM source file`);
  return base64ToArrayBuffer(contents.substring(prefix.length));
}
