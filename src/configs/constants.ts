import { Coin } from "@terran-one/cw-simulate";

export const CHAINS = ['terra', 'injective', 'juno', 'osmosis'] as const;
export type Chains = typeof CHAINS[number];

export type Defaults = {
  chains: {
    [chain in Chains]: {
      chainId: string;
      bech32Prefix: string;
      sender: string;
      funds: Coin[];
    };
  };
}

export const defaults: Defaults = {
  chains: {
    terra: {
      chainId: 'phoenix-1',
      bech32Prefix: 'terra',
      sender: 'terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6',
      funds: [
        { denom: 'uluna', amount: '1000' },
        { denom: 'uust', amount: '1000' },
      ],
    },
    
    juno: {
      chainId: 'juno-1',
      bech32Prefix: 'juno',
      sender: 'juno1mkrls242umevjcaz3w6q6kk0z0gxtpa2luh973',
      funds: [
        { denom: 'ujuno', amount: '1000' },
      ]
    },
    
    osmosis: {
      chainId: 'osmosis-1',
      bech32Prefix: 'osmo',
      sender: 'osmo1mkrls242umevjcaz3w6q6kk0z0gxtpa2p48w0l',
      funds: [
        { denom: 'uosmo', amount: '1000' },
      ]
    },
    
    injective: {
      chainId: 'injective-1',
      bech32Prefix: 'inj',
      sender: 'inj1mc3x97tqfmceuhwa0q83jdyjskcatqrlc45dp7',
      funds: [
        { denom: 'uinj', amount: '1000' },
      ]
    },
  },
};
