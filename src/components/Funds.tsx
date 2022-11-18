import Box from "@mui/material/Box";
import styled from "@mui/material/styles/styled";
import { Theme } from "@mui/material/styles/createTheme";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/system/styleFunctionSx";
import { Coin } from "@terran-one/cw-simulate";
import { ComponentType, PropsWithChildren, ReactNode, useRef, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const StyledCode = styled('code')(({ theme }) => ({
  borderRadius: 4,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.08)',
  marginLeft: theme.spacing(0.5),
  marginRight: theme.spacing(0.5),
  padding: 2,
}));

export interface IFundsProps {
  text?: ReactNode;
  TextComponent?: ComponentType<PropsWithChildren<{ sx?: SxProps<Theme> }>>;
  hideError?: boolean;
  onChange?(funds: Coin[]): void;
  onError?(err: unknown): void;
  sx?: SxProps<Theme>;
}

export default function Funds(props: IFundsProps) {
  const {
    TextComponent = Typography,
    text,
    hideError,
    onChange,
    onError,
    ...boxProps
  } = props;
  
  const ref = useRef<HTMLInputElement | null>();
  const [err, setErr] = useState('');
  
  const update = useDebounce(() => {
    if (!onChange || !ref.current) return;
    
    try {
        if (ref.current.value.trim()) {
          onChange(parseCoins(ref.current.value));
        }
        setErr('');
      } catch (err: any) {
        if ('message' in err)
          setErr(err.message);
        onError?.(err);
      }
  }, 500, [onChange, onError]);
  
  return (
    <Box {...boxProps}>
      {text}
      <TextField
        inputRef={ref}
        label="Funds"
        onKeyUp={update}
        placeholder={'1000 uluna, 4000 uust, ...'}
        sx={{width: '100%'}}
      />
      {!hideError && err && (
        <TextComponent fontStyle="italic" color="red">{err}</TextComponent>
      )}
    </Box>
  )
}

const parseCoins = (raw: string): Coin[] =>
  raw
  .split(',')
  .map(s => s.trim())
  .map(line => {
    const matches = line.match(/^([0-9]+)\s?([A-Za-z]+)$/);
    if (!matches)
      throw new Error(`Invalid coin format: ${line}`);

    return {
      denom: matches[2],
      amount: matches[1],
    }
  });
