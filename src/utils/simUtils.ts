
/**
 * Get the first default chain name by pattern `untitled-${i}` which doesn't exist in `chains` yet.
 * */
export function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains?.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}

export const isValidChainName = (name: string) => !!name.match(/^.+-\d+$/);
