import React, { Suspense } from "react";
import { Box, CircularProgress, SnackbarProps } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { fileUploadedState } from "../atoms/fileUploadedState";
import simulationState from "../atoms/simulationState";
import { snackbarNotificationState } from "../atoms/snackbarNotificationState";
import { validateSimulationJSON } from "../utils/fileUtils";

const DropzoneArea = React.lazy(async () => ({default: (await import('react-mui-dropzone')).DropzoneArea}))

interface IProps {
  wasmBuffers: ArrayBuffer[];
  setWasmBuffers: (fileBuffer: ArrayBuffer[]) => void;
}

const FileUpload = ({wasmBuffers, setWasmBuffers}: IProps) => {
  const setIsFileUploaded = useSetRecoilState(fileUploadedState);
  const setSimulationState = useSetRecoilState(simulationState);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const snackbarProps: SnackbarProps = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  };

  const handleOnFileDrop = (files: File[]) => {
    // Only allow one file to be uploaded
    const file: File = files[0];
    if (file.type === "application/wasm") {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const fileBuffer = reader.result as ArrayBuffer;
        const newSimulation = {
          simulation: {
            chains: [
              {
                chainId: "untitled-1",
                bech32Prefix: "terra",
              }
            ]
          }
        }
        setSimulationState(newSimulation);
        setIsFileUploaded(true);
      };

      reader.onerror = () => {
        setSnackbarNotification({
          ...snackbarNotification,
          open: true,
          message: "Error reading WASM binary file",
          severity: "error",
        });
      }
    }

    if (file.type === "application/json") {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const json = JSON.parse(reader.result as string)
        if (validateSimulationJSON(json)) {
          setSimulationState(json);
          setIsFileUploaded(true);
        } else {
          // TODO: Add error message when JSON is invalid
        }
      };

      reader.onerror = () => {
        setSnackbarNotification({
          ...snackbarNotification,
          open: true,
          message: "Error reading simulation file",
          severity: "error",
        });
      }
    }
  };

  const handleOnFileChange = (files: File[]) => {
    if (files.length === 0) {
      setIsFileUploaded(false);
    }
  };

  const handleOnFileDelete = (file: File) => {
    // Remove file from wasmBuffers
    const index = wasmBuffers.findIndex((buffer) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file as Blob);
      return reader.result === buffer;
    });
    if (index > -1) {
      wasmBuffers.splice(index, 1);
    } else {
      console.error("File not found in wasmBuffers");
    }
  };

  return (
    <Suspense fallback={<Fallback/>}>
      <DropzoneArea
        dropzoneClass="dropzone"
        acceptedFiles={["application/wasm", "application/json"]}
        showFileNames={true}
        dropzoneText={
          "Click to upload a simulation file or contract binary or Drag & drop a file here"
        }
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
