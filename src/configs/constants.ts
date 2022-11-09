
export const DEFAULT_CHAIN = 'phoenix-1';
export const SENDER_ADDRESS = 'terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6';
export const DEFAULT_FUNDS = [
  {denom: "uluna", amount: "1000"},
  {denom: "uust", amount: "1000" },
];

export const TerraConfig = {
  chainId: DEFAULT_CHAIN,
  bech32Prefix: 'terra',
};

export const OsmosisConfig = {
  chainId: 'osmosis-1',
  bech32Prefix: 'osmo',
};

export const InjectiveConfig = {
  chainId: 'injective-1',
  bech32Prefix: 'inj',
};

export const JunoConfig = {
  chainId: 'juno-1',
  bech32Prefix: 'jun',
}
