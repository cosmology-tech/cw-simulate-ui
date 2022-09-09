import React from "react";
import { DropzoneArea } from "mui-file-dropzone";
import { SnackbarProps } from "@mui/material";

interface IProps {
  setWasmBuffer: (fileBuffer: ArrayBuffer | null) => void;
}

const FileUpload = ({setWasmBuffer}: IProps) => {

  const snackbarProps: SnackbarProps = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    }
  };

  const handleOnFileDrop = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          setWasmBuffer(event.target.result as ArrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file as Blob);
    });
  }

  const handleOnFileChange = (files: File[]) => {
    // do nothing
  }

  const handleOnFileDelete = (file: File) => {
    console.log(file);
  }

  return (
    <DropzoneArea
      fileObjects={[""]}
      dropzoneText={"Click to upload a simulation file or contract binary or Drag & drop a file here"}
      onDrop={handleOnFileDrop}
      onDelete={handleOnFileDelete}
      alertSnackbarProps={snackbarProps}
      onChange={handleOnFileChange}/>
  );
};

export default FileUpload;