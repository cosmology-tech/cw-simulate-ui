import { useEffect, useState } from "react";
import CWSimulationBridge from "../CWSimulationBridge";
import { makeSimpleError } from "../utils/typeUtils";

const IDB_VERSION = 1;

export type SessionState = 'pending' | { error: any } | Session;

/** CWSimulateUI-specific IDB Session Helper */
export class Session {
  private static _instance: Session | undefined;
  private _idb: IDBDatabase | undefined;
  
  open() {
    if (!window.indexedDB) {
      return Promise.reject(new NoIndexedDBError());
    }
    
    return new Promise<this>((resolve, reject) => {
      const req = indexedDB.open('simulation', IDB_VERSION);
      req.onsuccess = () => {
        this._idb = req.result;
        resolve(this);
      };
      req.onerror = () => {
        console.error('Failed to open IDB:', req.error);
        reject(req.error);
      };
      req.onupgradeneeded = e => {
        //@ts-ignore
        this._migrate(e.target.result, e.oldVersion);
      };
      req.onblocked = () => {
        console.error('IDB blocked');
        reject(new BlockedError());
      };
    });
  }
  
  async close() {
    this._idb?.close();
  }
  
  save(sim: CWSimulationBridge, lastChainId: string) {
    localStorage['lastChainId'] = lastChainId;
    return this.tx('chains', 'readwrite', async tx => {
      const chainsStore = tx.objectStore('chains');
      await wrapRequest(chainsStore.put(sim.save(), sim.chainId));
    });
  }
  
  async load(sim: CWSimulationBridge, chainId: string) {
    if (!this._idb) throw new ConnectionError();
    const tx = this._idb.transaction('chains', 'readonly');
    const store = tx.objectStore('chains');
    
    const result = await wrapRequest(store.get(chainId));
    if (!result) throw new NoChainError(chainId);
    console.log(`Loaded ${result.length / 1024 / 1024} MB of data, processing...`);
    
    console.time('sim.load');
    await sim.load(result);
    console.timeEnd('sim.load');
    return this;
  }
  
  private _migrate(idb: IDBDatabase, oldVersion: number) {
    idb.createObjectStore('chains');
  }
  
  clear(chainId: string) {
    return this.tx('chains', 'readwrite', async tx => {
      const chainsStore = tx.objectStore('chains');
      await wrapRequest(chainsStore.delete(chainId));
    });
  }
  
  reset() {
    delete localStorage['lastChainId'];
    if (window.indexedDB) {
      indexedDB.deleteDatabase('simulation');
    }
  }
  
  private tx(storeNames: string | Iterable<string>, mode: IDBTransactionMode, callback: (tx: IDBTransaction) => void | Promise<void>) {
    if (!this._idb) return Promise.reject(new ConnectionError());
    return new Promise<this>(async (resolve, reject) => {
      const tx = this._idb!.transaction('chains', 'readwrite');
      tx.oncomplete = () => { resolve(this) }
      tx.onerror = () => { reject(tx.error) }
      tx.onabort = () => { reject(tx.error || new AbortError())}
      try {
        await callback(tx);
        tx.commit();
      } catch (err) {
        tx.abort();
        reject(err);
      }
    });
  }
  
  static async instance() {
    return this._instance || (this._instance = await new Session().open());
  }
}

export const useSession = () => {
  const [session, setSession] = useState<SessionState>('pending');
  useEffect(() => {
    Session.instance()
      .then(setSession)
      .catch(error => {setSession({error})});
  }, []);
  return session;
}

export const AbortError = makeSimpleError('Aborted');
export const BlockedError = makeSimpleError('IndexedDB connection blocked');
export const ConnectionError = makeSimpleError('No IndexedDB connection');
export const NoIndexedDBError = makeSimpleError('No IndexedDB support in browser');
export class NoChainError extends Error {
  constructor(chainId: string) {
    super(`No such chainId: ${chainId}`);
  }
}

function wrapRequest<T = any>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result);
    }
    req.onerror = () => {
      reject(req.error);
    }
  });
}

export const isValidSession = (session: SessionState): session is Session => !(session === 'pending' || 'error' in session);
