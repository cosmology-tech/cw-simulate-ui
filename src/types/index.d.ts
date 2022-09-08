import { CWSimulateEnv } from "@terran-one/cw-simulate";

declare global {
  interface Window {
    VM: any;
    CWEnv: CWSimulateEnv;
  }
}
