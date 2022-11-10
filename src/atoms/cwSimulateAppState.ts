import { CWSimulateApp } from "@terran-one/cw-simulate";
import { atom } from "jotai";
import { TerraConfig } from "../configs/constants";

const cwSimulateAppState = atom({
  app: new CWSimulateApp(TerraConfig)
});

export default cwSimulateAppState;
