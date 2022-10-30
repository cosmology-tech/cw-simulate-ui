import { CWSimulateApp } from "@terran-one/cw-simulate";
import { atom } from "jotai";

const cwSimulateAppState = atom({
  app: new CWSimulateApp({
    chainId: "terra-test",
    bech32Prefix: "terra"
  })
});

export default cwSimulateAppState;
