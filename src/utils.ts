export function getItem(
  label: string,
  key: string,
  icon: JSX.Element,
  children?: { key: any; icon: any; children: any; label: any }[],
  disabled?: boolean
) {
  return {
    key,
    icon,
    children,
    label,
  };
}
