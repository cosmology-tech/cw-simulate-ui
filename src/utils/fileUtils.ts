import { Validator } from 'jsonschema';
import * as validSimulationSchema from './validSimulationSchema.json';
import * as validConfigSchema from './validConfigSchema.json';

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

/**
 * Download simulation JSON file
 * @param content
 * @param fileName
 * @param contentType
 */
export const downloadJSON = (content: string, fileName: string, contentType = 'application/json') => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

/**
 * Validate JSON with its schema
 * @param json
 * @param jsonSchema
 */
export const validateJSON = (json: any, jsonSchema: any): boolean => {
  const v = new Validator();
  const result = v.validate(json, jsonSchema);
  // TODO: Return error message
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
