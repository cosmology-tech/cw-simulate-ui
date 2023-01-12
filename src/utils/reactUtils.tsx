import type { SxProps } from "@mui/system/styleFunctionSx";
import { ComponentType, DependencyList, useCallback } from "react";
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

export function useBind<P1, P2 extends Partial<P1> = Partial<P1>>(Component: ComponentType<P1>, boundProps: P2, deps: DependencyList = []) {
  const Comp = Component as any;
  return useCallback((props: Omit<P1, keyof P2> & Partial<P2>) => <Comp {...boundProps} {...props} />, [Component, ...deps]);
}
