# CW-DEBUG-UI

A web-based interface for debugging and testing the CosmWasm contract
without the need for setting up the Rust dev toolchain or a local dev testnet node.

## Installing and running locally

First, create a personal access token in [GitHub](https://github.com/settings/tokens),
and give it the `package:read` permission.

Then, update your _~.npmrc_ file with the following line:

```
//npm.pkg.github.com/:_authToken=MY_NEW_PAT
```

In addition, Mac users need to set the `TOKEN_FOR_GITHUB` value to the token value.
(You can update .zshrc or .bashrc as appropriate.)

Finally, install and run via npm:

```sh
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
