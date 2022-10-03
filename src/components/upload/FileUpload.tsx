import React, { Suspense } from "react";
import { Box, CircularProgress, SnackbarProps } from "@mui/material";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { base64ToArrayBuffer } from "../../utils/fileUtils";
import { useAtom } from "jotai";

const DropzoneArea = React.lazy(async () => ({default: (await import('react-mui-dropzone')).DropzoneArea}))

interface IProps {
  dropzoneText?: string;
  /** Variant of the FileUploader. Defaults to 'both'. */
  variant?: 'simulation' | 'contract' | 'both' | undefined;

  /** Callback which receives the uploaded file's name + contents buffer. */
  onAccept(filename: string, fileContent: Buffer | JSON): void;

  /** Callback for when user removes uploaded file. */
  onClear(): void;
}

const FileUpload = ({
  dropzoneText,
  variant = 'both',
  onAccept,
  onClear,
}: IProps) => {
  const [, setIsFileUploaded] = useAtom(fileUploadedState);
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
    if (file.type === "application/wasm") {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const contents = reader.result;
        if (!contents) {
          setNotification("Failed to extract bytecode", {severity: "error"});
          return;
        }

        try {
          const buffer = Buffer.from(extractByteCode(contents));
          onAccept(file.name, buffer);
        } catch (ex: any) {
          setNotification(`Failed to extract & store WASM bytecode: ${ex.message ?? ex}`, {severity: "error"});
          console.error(ex);
          return;
        }

        setIsFileUploaded(true);
      }

      reader.onerror = () => {
        setNotification("Error reading WASM binary file", {severity: "error"});
      }
    } else if (file.type === "application/json") {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        // TODO: confirmation prompt if simulation is already loaded b/c we're about to override that
        const json = JSON.parse(reader.result as string)

        // TODO: validate simulation JSON
        // if (validateSimulationJSON(json)) {
        //   setIsFileUploaded(true);
        // } else {
        //   // TODO: Add error message when JSON is invalid
        //   console.log("Invalid JSON");
        // }
        setIsFileUploaded(true);
        onAccept(file.name, json);
      };

      reader.onerror = () => {
        setNotification("Error reading simulation file", {severity: "error"});
      }
    }
  };

  const handleOnFileChange = (files: File[]) => {
    if (files.length === 0) {
      setIsFileUploaded(false);
      onClear();
    }
  };

  return (
    <Suspense fallback={<Fallback/>}>
      <DropzoneArea
        dropzoneClass="dropzone"
        acceptedFiles={getFileTypesByVariant(variant)}
        showFileNames={true}
        dropzoneText={text}
        onDrop={handleOnFileDrop}
        onChange={handleOnFileChange}
        alertSnackbarProps={snackbarProps}
        filesLimit={1}
        maxFileSize={50000000} // 50MB max file size ~ 10 contracts
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

function getFileTypesByVariant(variant: "simulation" | "contract" | "both" | undefined) {
  switch (variant) {
    case 'both':
      return ['application/wasm', 'application/json'];
    case 'simulation':
      return ['application/json'];
    case 'contract':
      return ['application/wasm'];
  }
}

function extractByteCode(contents: string | ArrayBuffer): ArrayBuffer {
  if (typeof contents !== 'string')
    return contents;
  const prefix = 'data:application/wasm;base64,';
  if (!contents.startsWith(prefix))
    throw new Error(`Malformed WASM source file`);
  return base64ToArrayBuffer(contents.substring(prefix.length));
}
