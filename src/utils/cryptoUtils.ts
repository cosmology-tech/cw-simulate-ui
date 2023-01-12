import { sha256 } from "@cosmjs/crypto/build/sha";
import { Secp256k1 } from "@cosmjs/crypto/build/secp256k1";
import { Random } from "@cosmjs/crypto/build/random";
import { fromBech32, toBech32 } from "@cosmjs/encoding/build/bech32";

export async function generateRandomAddress(bech32Prefix: string) {
  const pair = await Secp256k1.makeKeypair(Random.getBytes(32));
  const pub = Secp256k1.compressPubkey(pair.pubkey);
  return toBech32(bech32Prefix, sha256(pub).slice(0, 20));
}

/** Alias for `fromBech32`.
 * If the address is a valid Bech32 format, returns the identified prefix + (presumably) public key.
 * Otherwise, throws an exception.
 */
export const validateAddress = (address: string) => fromBech32(address);
