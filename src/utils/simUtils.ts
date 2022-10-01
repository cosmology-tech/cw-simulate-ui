import { useMemo } from "react";
import filteredChainsFromSimulationState from "../selectors/filteredChainsFromSimulationState";
import { useAtomValue } from "jotai";

/**
 * Get the chains from the simulation state.
 * @param sorted
 */
export function useChainNames(sorted: boolean = false) {
  const chains = useAtomValue(filteredChainsFromSimulationState);
  return useMemo(() => {
    const names = Object.values(chains).map(({chainId}) => chainId);
    if (sorted) names.sort((lhs, rhs) => lhs.localeCompare(rhs));
    return names;
  }, [chains]);
}

/**
 * Get the first default chain name by pattern `untitled-${i}` which doesn't exist in `chains` yet.
 * */
export function getDefaultChainName(chains: string[]) {
  let i = 1;
  while (chains?.includes(`untitled-${i}`)) ++i;
  return `untitled-${i}`;
}

export const isValidChainName = (name: string) => !!name.match(/^.+-\d+$/);
