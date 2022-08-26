import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import {IBackend, VMInstance, BasicBackendApi, BasicKVIterStorage, BasicQuerier} from "@terran-one/cosmwasm-vm-js";

const { Dragger } = Upload;

interface IProps {
  setIsFileUploaded: (uploadStatus: boolean) => void;
  setWasmBuffer: (fileBuffer: ArrayBuffer | null) => void;
}
const FileUpload = ({setIsFileUploaded, setWasmBuffer}: IProps) => {

  const backend: IBackend = {
    backend_api: new BasicBackendApi(),
    storage: new BasicKVIterStorage(),
    querier: new BasicQuerier(),
  };

  // Custom function to store file
  const storeFile = (fileProps: RcCustomRequestOptions) => {
    const {onSuccess, onError, file} = fileProps;
    window.Console.log(fileProps);
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
      if (status !== "uploading") {
        window.Console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      window.Console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Once you upload the file Menu Options on right will start appearing.
      </p>
    </Dragger>
  );
};

export default FileUpload;
