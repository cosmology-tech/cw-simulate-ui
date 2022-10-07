import { SxProps, Tab, Tabs, TabsProps, Theme } from "@mui/material";
import { ReactNode, SyntheticEvent } from "react";

export interface IT1TabsProps<T> {
  children?: ReactNode;
  value: T;
  variant?: TabsProps['variant'];
  onChange?(e: SyntheticEvent, value: T): void;
  sx?: SxProps<Theme>;
}

export function T1Tabs<T = string>(props: IT1TabsProps<T>) {
  return (
    <Tabs {...props} />
  )
}

export interface IT1TabProps<T> {
  children?: ReactNode;
  value: T;
}

export function T1Tab<T>({ children, ...props }: IT1TabProps<T>) {
  return (
    <Tab label={children} {...props} />
  )
}
