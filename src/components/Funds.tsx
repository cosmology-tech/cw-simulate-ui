import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles/createTheme";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system/styleFunctionSx";
import { Coin } from "@terran-one/cw-simulate";
import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";
import useDebounce from "../hooks/useDebounce";

export interface IFundsProps {
  text?: ReactNode;
  TextComponent?: ComponentType<PropsWithChildren<{ sx?: SxProps<Theme> }>>;
  hideError?: boolean;
  defaultValue?: string;
  onChange?(funds: Coin[]): void;
  onValidate?(valid: boolean): void;
  sx?: SxProps<Theme>;
}

export default function Funds(props: IFundsProps) {
  const {
    TextComponent = Typography,
    text,
    hideError,
    defaultValue,
    onChange,
    onValidate,
    ...boxProps
  } = props;

  const ref = useRef<HTMLInputElement | null>();
  const [err, setErr] = useState("");

  const update = useDebounce(
    () => {
      const value = ref.current?.value.trim() ?? "";

      try {
        if (value) {
          onChange?.(parseCoins(value));
        } else {
          onChange?.([]);
        }
        onValidate?.(true);
        setErr("");
      } catch (err: any) {
        setErr(err.message || "Failed to parse funds");
        onValidate?.(false);
      }
    },
    500,
    [onChange, onValidate]
  );

  return (
    <Box {...boxProps}>
      {text}
      <TextField
        inputRef={ref}
        label="Funds"
        onKeyUp={update}
        defaultValue={defaultValue}
        placeholder={"1000 uluna, 4000 uust, ..."}
        sx={{ width: "100%" }}
      />
      {!hideError && err && (
        <TextComponent fontStyle="italic" color="red">
          {err}
        </TextComponent>
      )}
    </Box>
  );
}

const parseCoins = (raw: string): Coin[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .map((line) => {
      const matches = line.match(/^([0-9]+)\s?([A-Za-z]+)$/);
      if (!matches) throw new Error(`Invalid coin format: ${line}`);

      return {
        denom: matches[2],
        amount: matches[1],
      };
    });
