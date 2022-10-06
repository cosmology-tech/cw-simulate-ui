import React, { Suspense, useContext, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { fileUploadedState } from "../../atoms/fileUploadedState";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { base64ToArrayBuffer, validateSimulationJSON } from "../../utils/fileUtils";
import { useSetAtom } from "jotai";
import { useDropzone } from 'react-dropzone';
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { MenuDrawerContext } from "../drawer/T1Drawer";

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
  onClear
}: IProps) => {
  const setIsFileUploaded = useSetAtom(fileUploadedState);
  const [filename, setFilename] = useState('');

  const text = dropzoneText || "Click to upload a simulation file or contract binary, or drop a file here";
  const setNotification = useNotification();

  const menuApi = useContext(MenuDrawerContext);

  const handleDropzoneClick = (event: any) => {
    if (event.target.parentElement.id === 'delete-icon') {
      event.stopPropagation();
    }
  };

  const deleteFile = () => {
    onClear();
    setFilename('');
    setIsFileUploaded(false);
    setNotification('File removed');
  };

  const setUploadSuccessState = (filename: string) => {
    setIsFileUploaded(true);
    setFilename(filename);
    setNotification("File uploaded successfully");
    menuApi.clearSelection();
  }

  const handleOnFileDrop = (files: File[]) => {
    if (!files.length) {
      return;
    }

    // TODO: confirmation prompt if simulation is already loaded?

    const file: File = files[0]; // we only support uploading one file

    if (getFileTypesByVariant(variant).indexOf(file.type) === -1) {
      setNotification("File type not supported", {severity: "error"});
      return;
    }

    if (file.size > 50000000) {
      setNotification("File too large - only files up to 50Mb arre supported", {severity: "error"});
      return;
    }

    const reader = new FileReader();

    switch (file.type) {
      case "application/wasm":
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

          setUploadSuccessState(file.name);
        }

        reader.onerror = () => {
          setNotification("Error reading WASM binary file", {severity: "error"});
        }

        break;

      case ("application/json"):
        reader.readAsText(file);

        reader.onload = () => {
          const json = JSON.parse(reader.result as string)

          // TODO: validate simulation JSON
          // if (!validateSimulationJSON(json)) {
          //   setNotification("Invalid simulation file", {severity: "error"});
          //   return;
          // }

          setUploadSuccessState(file.name);
          onAccept(file.name, json);
        };

        reader.onerror = () => {
          setNotification("Error reading simulation file", {severity: "error"});
        }

        break;

      default:
        throw new Error("Not implemented");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleOnFileDrop })
  return (
    <Suspense fallback={<Fallback/>}>
      <div {...getRootProps({onClick: handleDropzoneClick})} style={{cursor: 'pointer', padding: '8px'}}>
        <input {...getInputProps()} />
        {
          filename ?
            <>
              <AttachFileIcon fontSize="large" />
              <div style={{fontSize: '24px'}}>{filename} <DeleteIcon id='delete-icon' fontSize="small" onClick={deleteFile} /></div>
            </> :
            <>
              <div style={{fontSize: '24px'}}>{text}</div>
              <UploadFileIcon fontSize="large" />
            </>
        }
      </div>
    </Suspense>
  )
};

function Fallback() {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 250}}>
      <CircularProgress/>
    </Box>
  )
}

export default FileUpload;

function getFileTypesByVariant(variant: "simulation" | "contract" | "both") {
  switch (variant) {
    case 'both':
      return ['application/wasm', 'application/json'];
    case 'simulation':
      return ['application/json'];
    case 'contract':
      return ['application/wasm'];
    default:
      throw new Error("Not supported");
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
