import type { SxProps } from "@mui/system/styleFunctionSx";
import { useCallback } from "react";
import { useNotification } from "../atoms/snackbarNotificationState";
import type { Falsy } from "./typeUtils";

export function joinSx<T extends {}>(...sxs: (SxProps<T> | Falsy)[]): SxProps<T> {
  const result: any[] = [];
  for (const sx of sxs) {
    if (!sx) continue;
    if (Array.isArray(sx)) {
      result.splice(result.length-1, 0, ...sx);
    }
    else {
      result.push(sx);
    }
  }
  return result;
}

export function isChildOf(root: HTMLElement, child: HTMLElement | Falsy, log = false): boolean {
  let curr = child;
  while (curr && curr !== root) {
    curr = curr.parentElement;
  }
  return curr === root;
}
