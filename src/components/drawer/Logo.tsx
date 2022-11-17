import type { SxProps } from "@mui/system/styleFunctionSx";
import type { Theme } from "@mui/material/styles/createTheme";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";

interface ILogoProps {
  LinkComponent: React.ComponentType<React.PropsWithChildren<{
    href: string;
    sx: SxProps<Theme>;
  }>>;
  white?: boolean;
}

const Logo = React.memo((props: ILogoProps) => {
  const {LinkComponent, white} = props;
  const theme = useTheme();

  return (
    <LinkComponent href="/" sx={{borderRadius: 5}}>
      <img
        src={white ? "/T1_White.png" : "/T1.png"}
        height={25}
        alt={"CwSimulate"}
      />
      <div
        style={{
          color: white ? '#fff' : theme.palette.primary.main,
          fontWeight: "bold",
          fontSize: 14,
          marginLeft: 10,
        }}
      >
        CWSimulate
      </div>
    </LinkComponent>
  );
});

export default Logo;
