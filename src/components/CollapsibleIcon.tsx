import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface ICollapsibleIconProps {
  expanded?: boolean;
}

/** Icon for indicating collapsed/expanded state w/ built-in simple CSS animation */
export default function CollapsibleIcon({ expanded }: ICollapsibleIconProps) {
  return (
    <ChevronRightIcon
      sx={{
        transition: 'transform .15s linear',
        transform: `rotate(${expanded ? '90deg' : '0'})`,
      }}
    />
  )
}
