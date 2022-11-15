import { CodeInfo, Coin, ContractInfo, CWSimulateApp, CWSimulateAppOptions, TraceLog } from "@terran-one/cw-simulate";
import { Map } from "immutable";
import { DependencyList, useCallback, useEffect, useId, useReducer } from "react";
import { defaults } from "./configs/constants";

declare module "@terran-one/cw-simulate" {
  class CodeInfo {
    codeId: number;
    name: string;
    hidden: boolean;
  }

  class ContractInfo {
    address: string;
    trace: TraceLog[];
    hidden: boolean;
  }
}

type Watcher = {
  filter(app: CWSimulateApp): unknown;
  compare(last: unknown, curr: unknown): boolean;
  commit(state: unknown): unknown;
  dispatch(next: unknown): void;
  last: unknown;
}

export type WatcherComparator<T = unknown> = (last: T, curr: T) => boolean;
export type WatcherCommitter<T = unknown> = (raw: T) => T;

export default class CWSimulationBridge {
  private app = new CWSimulateApp(defaults.chains.terra);
  private watchers: Record<string, Watcher> = {};
  private updatePending = false;

  recreate(options: CWSimulateAppOptions) {
    this.app = new CWSimulateApp(options);
    this.sync();
    return this;
  }

  updateChainConfig(chainId: string, bech32Prefix: string) {
    this.app.chainId = chainId;
    this.app.bech32Prefix = bech32Prefix;
    this.sync();
    return this;
  }

  getCode(codeId: number): CodeInfo | undefined {
    return this.app.wasm.getCodeInfo(codeId);
  }

  storeCode(sender: string, name: string, content: Buffer, funds: Coin[] = []) {
    // TODO: use funds for `create`
    const codeId = this.app.wasm.create(sender, content);

    // augment code with UI-only data
    const codeInfo = this.getCode(codeId)!;
    codeInfo.codeId = codeId;
    codeInfo.name = name;
    codeInfo.hidden = false;

    this.sync();
    return codeId;
  }

  hideCode(codeId: number) {
    const info = this.getCode(codeId);
    if (!info) throw new Error(`No such codeId: ${codeId}`);
    info.hidden = true;
    this.sync();
    return this;
  }

  getContract(address: string) {
    return this.app.wasm.getContractInfo(address);
  }

  async instantiate(sender: string, codeId: number, msg: any, funds: Coin[] = []) {
    if (!this.getCode(codeId)) throw new Error(`Invalid codeId ${codeId}`);

    const trace: TraceLog[] = [];
    const result = await this.app.wasm.instantiateContract(sender, funds, codeId, msg, trace);
    const response = result.unwrap();

    const evt = response.events[0];
    if (evt.type !== 'instantiate') throw new Error('Expected instantiation event');
    const address = evt.attributes.find(attr => attr.key === '_contract_address')?.value;
    if (!address) {
      console.error('Failed to instantiate. Response:', response);
      throw new Error('Failed to instantiate. See logs for details');
    }

    const info = this.getContract(address)!;
    info.address = address;
    info.trace = trace;
    info.hidden = false;

    this.sync();
    return info;
  }

  hideContract(address: string) {
    const info = this.getContract(address);
    if (info) {
      info.hidden = true;
      this.sync();
    }
    return this;
  }

  setBalance(account: string, balance: Coin[]) {
    this.app.bank.setBalance(account, balance);
    this.sync();
    return this;
  }

  useWatcher<T>(
    filter: (app: CWSimulateApp) => T,
    /** Whether last stored value is equal to current */
    compare: WatcherComparator<T> = compareStrict,
    /** Optional committer. Creates a non-mutable snapshot of the given state. */
    commit: WatcherCommitter<T> = val => val,
    deps: DependencyList = [],
  ) {
    const init = filter(this.app);

    // fuck you eslint
    /* eslint-disable react-hooks/rules-of-hooks */
    const id = useId();
    /* eslint-disable react-hooks/rules-of-hooks */
    const [value, dispatch] = useReducer(
      (prev: T, next: T) => {
        return next;
      },
      init,
    );

    if (!this.watchers[id]) {
      this.watchers[id] = {
        filter,
        compare,
        commit,
        dispatch,
        last: commit(init),
      }
    }
    else {
      this.watchers[id] = {
        filter,
        compare,
        commit,
        dispatch,
        last: this.watchers[id].last,
      }
    }

    useEffect(() => {
      this.watchers[id] && this.evaluateWatcher(this.watchers[id]);
    }, deps);

    useEffect(() => {
      return () => {
        delete this.watchers[id];
      }
    }, []);

    return value;
  }

  async execute(sender: string, contractAddress: string, msg: any, funds: Coin[] = []) {
    const info = this.getContract(contractAddress);
    if (!info) throw new Error(`No such contract with address ${contractAddress}`);

    const result = await this.app.wasm.executeContract(sender, funds, info.address, msg, info.trace);
    this.sync();
    return result;
  }

  async query(contractAddress: string, msg: any) {
    const info = this.getContract(contractAddress);
    if (!info) throw new Error(`No such contract with address ${contractAddress}`);
    return await this.app.wasm.query(contractAddress, msg);
  }

  sync() {
    if (this.updatePending) return;
    this.updatePending = true;

    setTimeout(() => {
      this.updatePending = false;
      Object.values(this.watchers).forEach(this.evaluateWatcher);
    }, 0);
  }

  private evaluateWatcher = (watcher: Watcher) => {
    const {
      filter,
      compare,
      commit,
      dispatch,
      last,
    } = watcher;

    let next = filter(this.app);
    if (!compare(last, next)) {
      next = commit(next);
      watcher.last = next;
      dispatch(next);
    }
  }

  get accounts() {
    return this.app.bank.getBalances().toObject();
  }

  get chainId() {
    return this.app.chainId;
  }
  get bech32Prefix() {
    return this.app.bech32Prefix;
  }
}

export function useAccounts(bridge: CWSimulationBridge) {
  return bridge.useWatcher(
    app => app.bank.getBalances().toObject(),
    compareShallowObject,
  );
}

export function useCodes(bridge: CWSimulationBridge) {
  return bridge.useWatcher(
    app => (app.store.getIn(['wasm', 'codes']) as Map<number, CodeInfo>)?.toObject(),
    // TODO: we need cleaner storage. CodeInfo is NOT persistent
    () => false,
  )
}

export function useContracts(
  bridge: CWSimulationBridge,
  compare: WatcherComparator<Record<string, ContractInfo>> = compareDeep,
) {
  return bridge.useWatcher(
    app => (app.store.getIn(['wasm', 'contracts']) as Map<string, ContractInfo> ?? Map()).toObject(),
    compare,
  )
}

export function useContractTrace(
  bridge: CWSimulationBridge,
  contractAddress: string,
  compare: WatcherComparator<TraceLog[]> = compareShallowArray,
) {
  // Trace is currently not persistent, but we can just commit clones for comparison
  return bridge.useWatcher(
    () => bridge.getContract(contractAddress)?.trace ?? [],
    compare,
    trace => trace.slice(),
    [contractAddress],
  );
}

export const compareStrict = (last: unknown, curr: unknown) => last === curr;
/** Compares each element of two arrays by identity. Order matters. */
export function compareShallowArray(last: unknown[], curr: unknown[]) {
  if (last.length !== curr.length) return false;
  for (let i = 0; i < last.length; ++i) {
    if (last[i] !== curr[i]) return false;
  }
  return true;
}
/** Compares each property of two objects by identity. Order of properties does not matter. */
export function compareShallowObject(last: any, curr: any) {
  if (!compareShallowArray(Object.keys(last), Object.keys(curr)))
    return false;
  for (const prop in last) {
    if (last[prop] !== curr[prop]) return false;
  }
  return true;
}
export function compareDeep(lhs: any, rhs: any): boolean {
  // easy cases
  if (lhs === rhs)
    return true;
  if (typeof lhs !== 'object' || typeof rhs !== 'object')
    return lhs === rhs;

  // assert both objects have same keys
  const lKeys = new Set(Object.keys(lhs));
  const rKeys = new Set(Object.keys(rhs));
  for (const key of lKeys)
    if (!rKeys.has(key)) return false;
  for (const key of rKeys)
    if (!lKeys.has(key)) return false;

  // recurse
  for (const key in lhs) {
    if (!compareDeep(lhs[key], rhs[key]))
      return false;
  }
  return true;
}
