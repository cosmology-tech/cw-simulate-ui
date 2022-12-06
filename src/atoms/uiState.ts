import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { SubMenu } from "src/components/drawer/T1Drawer";

export const darkModeState = atomWithStorage('darkmode', false);
export const drawerSubMenuState = atom<SubMenu | undefined>(undefined);
