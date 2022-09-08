import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Upload } from "antd";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import {
  BasicBackendApi,
  BasicKVIterStorage,
  BasicQuerier,
  IBackend,
  VMInstance,
} from "@terran-one/cosmwasm-vm-js";
import { useRecoilState } from "recoil";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import { fileUploadedAtom } from "../atoms/fileUploadedAtom";

const {Dragger} = Upload;

interface IProps {
  setWasmBuffer: (fileBuffer: ArrayBuffer | null) => void;
}

const FileUpload = ({setWasmBuffer}: IProps) => {
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationAtom
  );
  const [_, setIsFileUploaded] = useRecoilState(fileUploadedAtom);
  const backend: IBackend = {
    backend_api: new BasicBackendApi(),
    storage: new BasicKVIterStorage(),
    querier: new BasicQuerier(),
  };

  // Custom function to store file
  const storeFile = (fileProps: RcCustomRequestOptions) => {
    const {onSuccess, onError, file} = fileProps;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          setWasmBuffer(event.target.result as ArrayBuffer);
          window.VM = new VMInstance(backend);
          window.VM.build(event.target.result).then(() => {
            //TODO: Move the buffer either to redux or IndexedDB
            setIsFileUploaded(true);
            onSuccess!("done");
            resolve(event.target!.result);
          });
        }
      };
      reader.onerror = (err) => {
        onError!(err, "error");
        reject(err);
      };
      reader.readAsArrayBuffer(file as Blob);
    });
  };

  const props: UploadProps = {
    name: "file",
    accept: ".wasm,",
    maxCount: 1,
    customRequest: storeFile,
    onChange(info) {
      const {status} = info.file;
      if (status === "done") {
        setSnackbarNotification({
          ...snackbarNotification,
          severity: "success",
          open: true,
          message: `${info.file.name} file uploaded successfully.`,
        });
      } else if (status === "error") {
        setSnackbarNotification({
          ...snackbarNotification,
          severity: "error",
          open: true,
          message: `${info.file.name} file upload failed.`,
        });
      }
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined/>
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Once you upload the file Menu Options on right will start appearing.
        </p>
      </Dragger>
    </div>
  );
};

export default FileUpload;
