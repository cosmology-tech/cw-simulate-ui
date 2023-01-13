import { EnglishMnemonic } from "@cosmjs/crypto/build/bip39";
import CachedIcon from "@mui/icons-material/Cached";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import useControlled from "@mui/utils/useControlled";
import { useCallback, useEffect, useState } from "react";
import useSimulation from "../../hooks/useSimulation";
import CopyToClipBoard from "../simulation/CopyToClipBoard";
import { generateRandomWallet, generateWallet } from "../../utils/cryptoUtils";
import T1Dialog, { T1DialogProps } from "./T1Dialog";

const wordlist = EnglishMnemonic.wordlist;

export interface Wallet {
  /** Public key bytes */
  pubkey: Uint8Array;
  /** Private key bytes */
  privkey: Uint8Array;
  /** Bech32 address */
  address: string;
  /** Mnemonic used */
  mnemonic: string;
  /** Derivation path used */
  derivationPath: string;
}

export interface GenerateWalletDialogProps extends Omit<T1DialogProps<Wallet>, 'actions'> {
  mnemonic?: string;
  defaultMnemonic?: string;
  derivationPath?: string;
  defaultDerivationPath?: string;
}

/** Dialog for generating Wallets
 * 
 * **WARNING:** These wallets are not secure and should only be used within CWSimulateUI for testing!
 */
export default function GenerateWalletDialog({
  title = 'Generate Wallet',
  mnemonic: controlledMnemonic,
  defaultMnemonic,
  derivationPath: controlledDerivationPath,
  defaultDerivationPath = "m/44'/1'/0'/0",
  ...props
}: GenerateWalletDialogProps)
{
  const sim = useSimulation();
  const prefix = sim.bech32Prefix;
  
  const [mnemonic, setMnemonic] = useControlled({
    controlled: controlledMnemonic,
    default: defaultMnemonic,
    name: 'GenerateWalletDialog',
    state: 'mnemonic'
  });
  const [path, setPath] = useControlled({
    controlled: controlledDerivationPath,
    default: defaultDerivationPath,
    name: 'GenerateWalletDialog',
    state: 'derivationPath',
  });
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  
  useEffect(() => {
    if (!mnemonic) return;
    setWallet(null);
    generateWallet(prefix, mnemonic, path).then(setWallet).catch(()=>{});
  }, [mnemonic, path]);
  useEffect(() => {
    mnemonic || generateRandomWallet(prefix, path).then(wallet => {
      setWallet(wallet);
      setMnemonic(wallet.mnemonic);
    });
  }, []);
  
  const randomize = useCallback(() => {
    setWallet(null);
    generateRandomWallet(prefix, path).then(wallet => {
      setWallet(wallet);
      setMnemonic(wallet.mnemonic);
    }).catch(()=>{});
  }, []);
  
  return (
    <T1Dialog<Wallet>
      title={title}
      {...props}
      actions={api => (
        <>
          <Button onClick={() => api.cancel()}>Cancel</Button>
          <Button
            disabled={!wallet}
            onClick={() => wallet && api.finish({
              address: wallet.address,
              derivationPath: path,
              mnemonic,
              privkey: wallet.privkey,
              pubkey: wallet.pubkey,
            })}
          >
            Accept
          </Button>
        </>
      )}
    >
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2, minWidth: 400 }}>
        <Button disabled={!wallet} variant='contained' onClick={randomize}>
          <CachedIcon sx={{ mr: 1 }} />
          Generate
        </Button>
        <TextField
          multiline
          label='Mnemonic'
          helperText='See BIP39 for details'
          value={mnemonic}
          onChange={e => setMnemonic(e.target.value)}
        />
        <TextField
          label='Derivation Path'
          helperText='See SLIP10, SLIP44, BIP44 for details'
          value={path}
          onChange={e => setPath(e.target.value)}
        />
        <TextField
          disabled
          label='Address'
          value={wallet?.address ?? ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <CopyToClipBoard data={wallet?.address ?? ''} />
              </InputAdornment>
            )
          }}
        />
      </DialogContent>
    </T1Dialog>
  )
}
