import type { GridSize } from "@mui/system";

export type Falsy = undefined | null | false;

export type Defined<T> = T extends null | undefined ? never : T;

export type AsJSON<T> = T extends JSONifiable
  ? ReturnType<T['toJSON']>
  : T extends Function
  ? never
  : T extends (infer E)[]
  ? AsJSON<E>[]
  : T extends object
  ? {
      [p in (string | number) & keyof T as (T[p] extends Function ? never : p)]: AsJSON<T[p]>;
    }
  : T;

type JSONifiable = {
  toJSON(): any;
}

type GridSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type GridSizeProps = {
  [s in GridSizeName]?: boolean | GridSize;
}
