import React, { Suspense } from "react";
import { Box, CircularProgress, SnackbarProps } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { fileUploadedState } from "../atoms/fileUploadedState";
import simulationState, { Chain } from "../atoms/simulationState";
import { showNotification, snackbarNotificationState } from "../atoms/snackbarNotificationState";
import { validateSimulationJSON } from "../utils/fileUtils";
import { useParams } from "react-router-dom";

const DropzoneArea = React.lazy(async () => ({default: (await import('react-mui-dropzone')).DropzoneArea}))

interface IProps {
  dropzoneText?: string;
  fileTypes: string[];
}

const FileUpload = ({dropzoneText, fileTypes}: IProps) => {
  const setIsFileUploaded = useSetRecoilState(fileUploadedState);
  const [simulation, setSimulation] = useRecoilState(simulationState);
  const setSnackbarNotification = useSetRecoilState(snackbarNotificationState);
  const param = useParams();
  const snackbarProps: SnackbarProps = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  };

  const text = dropzoneText || "Click to upload a simulation file or contract binary or Drag & drop a file here";

  const handleOnFileDrop = (files: File[]) => {
    // Only allow one file to be uploaded
    const file: File = files[0];
    fileTypes?.forEach((fileType: string) => {
        if (file.type === "application/wasm") {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          const prevChains = [...simulation.simulation.chains] || [];
          const prevChain = prevChains.find((chain: any) => chain.id === param.id);
          const prevCodes = prevChain?.codes || [];
          debugger;
          reader.onload = () => {
            const fileBuffer = reader.result;
            if (prevChains.length === 0) {
              setSimulation({
                simulation: {
                  chains: [
                    {
                      chainId: 'untitled-1',
                      bech32Prefix: 'terra',
                      accounts: [
                        {
                          id: 'alice',
                          address: 'terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6',
                          balance: 100000000,
                        },
                      ],
                      codes: [
                        ...prevCodes,
                        {
                          id: file.name,
                          wasmBinaryB64: fileBuffer!.toString(),
                          instances: [],
                        },
                      ],
                      states: [],
                    },
                  ],
                },
              });
            } else {
              setSimulation({
                ...simulation,
                simulation: {
                  ...simulation.simulation,
                  chains: simulation.simulation.chains.map((chain: any) => {
                    if (chain.chainId === param.id) {
                      return {
                        ...chain,
                        codes: [
                          ...chain.codes,
                          {
                            id: file.name,
                            wasmBinaryB64: fileBuffer!.toString(),
                            instances: [],
                          }
                        ],
                      }
                    }
                    return chain;
                  })
                }
              });
            }

            setIsFileUploaded(true);
          }

          reader.onerror = () => {
            showNotification(setSnackbarNotification, "Error reading WASM binary file", "error");
          }
        }

        if (file.type === "application/json") {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            const json = JSON.parse(reader.result as string)
            if (validateSimulationJSON(json)) {
              setSimulation(json);
              setIsFileUploaded(true);
            } else {
              // TODO: Add error message when JSON is invalid
            }
          };

          reader.onerror = () => {
            showNotification(setSnackbarNotification, "Error reading simulation file", "error");
          }
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
