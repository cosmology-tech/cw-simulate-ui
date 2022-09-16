import { atom } from "recoil";

export type Payload = {
  json: any;
  text: string | undefined;
};

export const payloadState = atom({
  key: 'payloadState',
  default: {
    json: {},
    text: undefined
  } as Payload,
});
