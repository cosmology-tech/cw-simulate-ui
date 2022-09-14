import React, { Suspense } from "react";
import { Box, CircularProgress, SnackbarProps } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { fileUploadedState } from "../atoms/fileUploadedState";

const DropzoneArea = React.lazy(async () => ({default: (await import('react-mui-dropzone')).DropzoneArea}))

interface IProps {
  wasmBuffers: ArrayBuffer[];
  setWasmBuffers: (fileBuffer: ArrayBuffer[]) => void;
}

const FileUpload = ({wasmBuffers, setWasmBuffers}: IProps) => {
  const setIsFileUploaded = useSetRecoilState(fileUploadedState);
  const snackbarProps: SnackbarProps = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
  };

  const handleOnFileDrop = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          setWasmBuffers([...wasmBuffers, event.target.result as ArrayBuffer]);
          setIsFileUploaded(true);
        }
      };
      reader.readAsArrayBuffer(file as Blob);
    });
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
    <Suspense fallback={<Fallback />}>
      <DropzoneArea
        dropzoneClass="dropzone"
        acceptedFiles={["application/wasm"]}
        showFileNames={true}
        dropzoneText={
          "Click to upload a simulation file or contract binary or Drag & drop a file here"
        }
        onDrop={handleOnFileDrop}
        onDelete={handleOnFileDelete}
        alertSnackbarProps={snackbarProps}
        onChange={handleOnFileChange}
      />
    </Suspense>
  );
};

function Fallback() {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250}}>
      <CircularProgress />
    </Box>
  )
}

export default FileUpload;
