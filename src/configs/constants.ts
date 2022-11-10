import { Coin } from "@terran-one/cw-simulate/dist/types";

export const DEFAULT_CHAIN = 'phoenix-1';
export const DEFAULT_TERRA_ADDRESS = 'terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6';
export const DEFAULT_JUNO_ADDRESS = 'juno1l6asmnfusqja55359zgl4hnredggxq3vmy474a';
export const DEFAULT_INJECTIVE_ADDRESS = 'inj1akxycslq8cjt0uffw4rjmfm3echchptu52a2da';
export const DEFAULT_OSMOSIS_ADDRESS = 'osmo1l267dmlmprhu4p5aqslf50f495vjqlg340e5ya';
export const DEFAULT_TERRA_FUNDS: Coin[] = [
  {denom: "uluna", amount: "1000"},
  {denom: "uust", amount: "1000"},
];

export const DEFAULT_JUNO_FUNDS: Coin[] = [
  {denom: "ujuno", amount: "1000"},
  {denom: "juno", amount: "1000"},
];

export const DEFAULT_INJECTIVE_FUNDS: Coin[] = [
  {denom: "uinj", amount: "1000"},
  {denom: "inj", amount: "1000"},
];

export const DEFAULT_OSMOSIS_FUNDS: Coin[] = [
  {denom: "uosmo", amount: "1000"},
  {denom: "osmo", amount: "1000"},
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
  bech32Prefix: 'juno',
}
