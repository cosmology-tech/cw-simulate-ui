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
      sender: 'juno1l6asmnfusqja55359zgl4hnredggxq3vmy474a',
      funds: [
        { denom: 'ujuno', amount: '1000' },
      ]
    },
    
    osmosis: {
      chainId: 'osmosis-1',
      bech32Prefix: 'osmo',
      sender: 'osmo1l267dmlmprhu4p5aqslf50f495vjqlg340e5ya',
      funds: [
        { denom: 'uosmo', amount: '1000' },
      ]
    },
    
    injective: {
      chainId: 'injective-1',
      bech32Prefix: 'inj',
      sender: 'inj1akxycslq8cjt0uffw4rjmfm3echchptu52a2da',
      funds: [
        { denom: 'uinj', amount: '1000' },
      ]
    },
  },
};
