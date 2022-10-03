import { SxProps, Theme } from "@mui/material";
import React from "react";
import { ORANGE_3, WHITE } from "../../configs/variables";

interface ILogoProps {
  LinkComponent: React.ComponentType<React.PropsWithChildren<{
    href: string;
    sx: SxProps<Theme>;
  }>>;
  white?: boolean;
}

const Logo = React.memo((props: ILogoProps) => {
  const {LinkComponent, white} = props;

  return (
    <LinkComponent href="/" sx={{borderRadius: 5}}>
      <img
        src={white ? "/T1_White.png" : "/T1.png"}
        height={25}
        alt={"Terran One"}
      />
      <div
        style={{
          color: white ? WHITE : ORANGE_3,
          fontWeight: "bold",
          fontSize: 14,
          marginLeft: 10,
        }}
      >
        Terran One
      </div>
    </LinkComponent>
  );
});

export default Logo;
