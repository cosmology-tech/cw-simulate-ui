import { ReactNode } from "react";
import T1Container from "../components/grid/T1Container";

export interface IFullSizeStoryProps {
  children?: ReactNode;
  padding?: number;
}

export default function FullSizeStory(props: IFullSizeStoryProps) {
  const {
    children,
    padding = 10,
  } = props;
  
  return (
    <T1Container
      sx={{
        position: 'absolute',
        top: padding,
        left: padding,
        right: padding,
        bottom: padding,
        height: 'auto',
      }}
    >
      {children}
    </T1Container>
  )
}
