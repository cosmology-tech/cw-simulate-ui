import { Bip39, EnglishMnemonic } from "@cosmjs/crypto/build/bip39";
import { sha256 } from "@cosmjs/crypto/build/sha";
import { Slip10, Slip10Curve, stringToPath } from "@cosmjs/crypto/build/slip10";
import { Secp256k1 } from "@cosmjs/crypto/build/secp256k1";
import { Random } from "@cosmjs/crypto/build/random";
import { fromBech32, toBech32 } from "@cosmjs/encoding/build/bech32";

export const DEFAULT_DERIVATION_PATH = "m/44'/1'/0'/0";

export async function generateRandomWallet(bech32Prefix: string, derivationPath = DEFAULT_DERIVATION_PATH) {
  const entropy = Random.getBytes(16);
  const mnemonic = Bip39.encode(entropy);
  return await generateWallet(bech32Prefix, mnemonic.toString(), derivationPath);
}

export async function generateWallet(bech32Prefix: string, mnemonic: string, derivationPath = DEFAULT_DERIVATION_PATH) {
  const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(mnemonic));
  
  const { privkey } = Slip10.derivePath(Slip10Curve.Secp256k1, seed, stringToPath(derivationPath));
  
  const pair = await Secp256k1.makeKeypair(privkey);
  const pub = Secp256k1.compressPubkey(pair.pubkey);
  return {
    bech32Prefix,
    derivationPath,
    mnemonic: mnemonic.toString(),
    address: toBech32(bech32Prefix, sha256(pub).slice(0, 20)),
    privkey: pair.privkey,
    pubkey: pair.pubkey,
  };
}

/** Alias for `fromBech32`.
 * If the address is a valid Bech32 format, returns the identified prefix + (presumably) public key.
 * Otherwise, throws an exception.
 */
export const validateAddress = (address: string) => fromBech32(address);
