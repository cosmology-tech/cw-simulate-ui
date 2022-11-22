import { Validator } from 'jsonschema';
import * as validSimulationSchema from './jsonSchema/validSimulationSchema.json';
import * as validConfigSchema from './jsonSchema/validConfigSchema.json';
import * as validAccountSchema from './jsonSchema/validAccountSchema.json';

/**
 * Read the upload wasm file and convert to ArrayBuffer
 * @param file - upload wasm file
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read the upload wasm file as array buffer and convert to base64 string
 * @param buffer
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Convert base64 string to array buffer
 * @param base64
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const download = (content: BlobPart | BlobPart[], fileName: string, contentType: string) => {
  const a = document.createElement('a');
  const file = new Blob(Array.isArray(content) ? content : [content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Download simulation JSON file
 * @param content
 * @param fileName
 * @param contentType
 */
export const downloadJSON = (content: string, fileName: string, contentType = 'application/json') =>
  download(content, fileName, contentType);

export const downloadWasm = (content: ArrayBuffer, fileName: string, contentType = 'application/wasm') =>
  download(content, fileName, contentType);

/**
 * Validate JSON with its schema
 * @param json
 * @param jsonSchema
 */
export const validateJSON = (json: any, jsonSchema: any): boolean => {
  const v = new Validator();
  const result = v.validate(json, jsonSchema);

  // TODO: Return error message
  if (!result.valid) {
    console.error(`JSON validation failed:\n${result.toString()}`);
  }

  return result.valid;
}

/**
 * validate the simulation JSON with JSON schema
 * @param simulationJSON - simulation JSON
 */
export const validateSimulationJSON = (simulationJSON: any): boolean => {
  return validateJSON(simulationJSON, validSimulationSchema);
}

/**
 * validate the config JSON with JSON schema
 * @param configJSON
 */
export const validateConfigJSON = (configJSON: any): boolean => {
  return validateJSON(configJSON, validConfigSchema);
}

export const validateAccountJSON = (accountJSON: any): boolean => {
  return validateJSON(accountJSON, validAccountSchema);
}
