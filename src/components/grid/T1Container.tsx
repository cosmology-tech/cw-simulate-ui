import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { ElementType, ReactNode } from "react";

export interface IT1ContainerProps {
  children?: ReactNode;
  WrapperComponent?: ElementType<IWrapperProps>;
  ContentComponent?: ElementType<IContentProps>;
  sx?: SxProps<Theme>;
  className?: string;
}

interface IWrapperProps {
  children: ReactNode;
  sx: SxProps<Theme>;
}

interface IContentProps {
  children?: ReactNode;
  sx: SxProps<Theme>;
}

/** T1Container is designed to limit flexible size content to a responsive layout height. */
export default function T1Container({
  children,
  WrapperComponent = Box,
  ContentComponent = Box,
  className,
  sx,
}: IT1ContainerProps) {
  return (
    <WrapperComponent
      sx={[
        {
          position: 'relative',
          height: '100%',
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      className={`T1Container-root ${className}`}
    >
      <ContentComponent
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        className="T1Container-content"
      >
        {children}
      </ContentComponent>
    </WrapperComponent>
  )
}
