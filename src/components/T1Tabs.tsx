import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { Theme } from "@mui/system/createTheme";
import type { SxProps } from "@mui/system/styleFunctionSx";
import { atom, useAtom, WritableAtom } from "jotai";
import {
  AriaAttributes,
  Children,
  ComponentType,
  isValidElement,
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useRef,
} from "react";
import { joinSx } from "../utils/reactUtils";

type TabAtom = WritableAtom<string | undefined, string, void>;

type T1TabsChildren = ReactElement<IT1TabProps> | ReactElement<IT1TabProps>[];

export type IT1TabsProps = AriaAttributes & {
  children?: T1TabsChildren;
  withAtom?: WritableAtom<string, string, void>;
  ContentContainer?: ComponentType<PropsWithChildren>;
  className?: string;
  sx?: SxProps<Theme>;
  right?: ReactNode;
};

export function T1Tabs(props: IT1TabsProps) {
  const {
    children,
    withAtom,
    className = "",
    sx,
    ContentContainer = ({ children }) => <>{children}</>,
    right,
    ...rest
  } = props;

  const atomless = useRef<TabAtom | undefined>();
  let [current, setCurrent] = useWithAtom(atomless, withAtom);
  current = current || getFirstTab(children);
  const tabs: ReactElement[] = [];
  let content: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    let { value, label } = child.props;
    value ??= label;

    tabs.push(<Tab key={value} {...{ value, label }} />);
    if (current === value) {
      content = child;
    }
  });

  return (
    <Grid
      container
      direction="column"
      gap={2}
      className={`T1Tabs-root ${className}`}
      sx={joinSx(
        {
          height: "100%",
        },
        sx
      )}
      {...rest}
    >
      <Grid
        item
        className="T1Tabs-tabs"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={current}
          onChange={(_, value) => {
            setCurrent(value);
          }}
        >
          {tabs}
        </Tabs>
        {right}
      </Grid>
      <Grid item flex={1} className="T1Tabs-content">
        <ContentContainer>{content}</ContentContainer>
      </Grid>
    </Grid>
  );
}

export interface IT1TabProps<T extends string = string> {
  children?: ReactNode;
  value?: T;
  label: string;
}

export function T1Tab<T extends string = string>({ children }: IT1TabProps<T>) {
  return <>{children}</>;
}

function useWithAtom(
  atomless: MutableRefObject<TabAtom | undefined>,
  withAtom: TabAtom | undefined
) {
  let feck: TabAtom;
  if (!withAtom) {
    if (!atomless.current) {
      atomless.current = atom<string | undefined>(undefined);
    }
    feck = atomless.current!;
  } else {
    feck = withAtom;
  }
  return useAtom(feck);
}

function getFirstTab(children: T1TabsChildren | undefined) {
  const all = Children.map(children, (child) => {
    if (!isValidElement(child)) return null;
    return child.props.value || child.props.label;
  })?.filter((v) => !!v);
  if (all && all.length) return all[0];
}
