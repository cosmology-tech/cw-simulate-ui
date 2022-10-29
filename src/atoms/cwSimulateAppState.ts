import { CWSimulateApp } from "@terran-one/cw-simulate";
import { atom } from "jotai";

const cwSimulateAppAtom = atom({app: new CWSimulateApp({chainId: "test", bech32Prefix: "test"})});

export default cwSimulateAppAtom;
