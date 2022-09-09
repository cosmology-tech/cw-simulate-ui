Test Contracts
==============

### hello_world-aarch64.wasm

| Execute      | Query        |
|--------------|--------------|
| increment {} | get_count {} |

### [hackatom.wasm](https://github.com/CosmWasm/cosmwasm/blob/main/contracts/hackatom/src/contract.rs)

| Execute                     | Query                     |
|-----------------------------|---------------------------|
| release {}                  | verifier {}               |
| cpu_loop {}                 | other_balance { address } |
| memory_loop {}              | recurse {depth, work}     |
| message_loop {}             | get_int {}                |
| allocate_large_memory {}    |                           |
| panic {}                    |                           |
| user_errors_in_api_calls {} |                           |
