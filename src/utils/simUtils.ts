import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import filteredChainsFromSimulationState from "../selectors/filteredChainsFromSimulationState";

export function useChainNames(sorted = false) {
  const chains = useRecoilValue(filteredChainsFromSimulationState);
  return useMemo(() => {
    const names = Object.values(chains).map(({chainId}) => chainId);
    if (sorted) names.sort((lhs, rhs) => lhs.localeCompare(rhs));
    return names;
  }, [chains]);
}

/** Get the first default chain name by pattern `untitled-${i}` which doesn't exist in `chains` yet. */
export function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains?.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}

export const isValidChainName = (name: string) => !!name.match(/^.+-\d+$/);
