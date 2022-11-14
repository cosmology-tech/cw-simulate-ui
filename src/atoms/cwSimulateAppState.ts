import { CWSimulateApp } from "@terran-one/cw-simulate";
import { atom } from "jotai";
import { defaults } from "../configs/constants";

const cwSimulateAppState = atom({
  app: new CWSimulateApp(defaults.chains.terra),
});

export default cwSimulateAppState;
