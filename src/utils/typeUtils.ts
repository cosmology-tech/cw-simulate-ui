import type { GridSize } from "@mui/system";
import type { Theme as MuiTheme } from "@mui/material/styles/createTheme";
import type { SxProps as MuiSxProps } from "@mui/system/styleFunctionSx";
import type { Coin, RustResult } from "@terran-one/cw-simulate";
import { Err, Ok, Result } from "ts-results";

export type Falsy = undefined | null | false;

export type MaybeError<E = string> = { error?: E };

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

export type Theme = MuiTheme;
export type SxProps = MuiSxProps<Theme>;

type GridSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type GridSizeProps = {
  [s in GridSizeName]?: boolean | GridSize;
}

export function fromRustResult<T>(result: RustResult<T>): Result<T, string> {
  if ('ok' in result) {
    return Ok(result.ok);
  }
  if ('error' in result) {
    return Err(result.error);
  }
  throw new Error('Invalid RustResult');
}

export function toRustResult<T>(result: Result<T, string>): RustResult<T> {
  if (result.ok) {
    return { ok: result.val };
  } else {
    return { error: result.val };
  }
}

export const stringifyFunds = (funds: Coin[]) => funds.map(coin => `${coin.amount}${coin.denom}`).join(', ');
