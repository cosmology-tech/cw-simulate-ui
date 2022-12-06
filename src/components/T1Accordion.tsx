import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Children, cloneElement, isValidElement, ReactNode, useState } from "react";
import { useTheme } from "../configs/theme";
import { joinSx } from "../utils/reactUtils";
import { SxProps } from "../utils/typeUtils";
import CollapsibleWidget, { ICollabsibleWidgetProps } from "./CollapsibleWidget";

type ChildProps = {
  key: string;
  expanded: boolean;
  onClick(): void;
}

export interface IT1AccordionProps {
  children?: ReactNode;
  defaultExpanded?: number;
  className?: string;
  sx?: SxProps;
}

export function T1Accordion(props: IT1AccordionProps) {
  const {
    defaultExpanded = -1,
    className,
    sx,
  } = props;
  
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const children = (Children.map(props.children, child => isValidElement<ChildProps>(child) ? child : null) ?? [])
    .filter(child => !!child)
    .map((child, idx) => {
      return cloneElement(child, {
        key: child.props.key || idx.toString(),
        expanded: expanded === idx,
        onClick: () => setExpanded(idx),
      });
    });
  
  return (
    <Grid
      container
      direction="column"
      className={`T1Accordion-root ${className}`}
      sx={joinSx(
        {
          "> .T1Accordion-section": {
            p: 0,
            borderRadius: 0,
          },
          "> .T1Accordion-section:first-of-type": {
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          },
        },
        sx,
      )}
    >
      {children}
    </Grid>
  )
}

export type IT1AccordionSectionProps = Omit<ICollabsibleWidgetProps, 'collapsed' | 'collapsible'>;

type IT1AccordionSectionExtendedProps = IT1AccordionSectionProps & {
  expanded: boolean;
}

export function T1AccordionSection(_props: IT1AccordionSectionProps) {
  const {
    children,
    expanded,
    ...props
  } = _props as IT1AccordionSectionExtendedProps;
  
  const theme = useTheme();
  
  return (
    <CollapsibleWidget
      {...props}
      collapsed={!expanded}
      className="T1Accordion-section"
    >
      <Box sx={{
        p: 1,
        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        boxSizing: 'border-box',
      }}>
        {children}
      </Box>
    </CollapsibleWidget>
  )
}
