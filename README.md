## Cryptoo

Easiest & cheapest way to set up your own bitcoin payment system.

## Usage

```js
const Cryptoo = require('cryptoo');

// Create a cryptoo instance
// Start syncing blockchain data
const cryptoo = new Cryptoo();

// Get recovery phrase to backup your HD wallet
cryptoo.getRecoveryPhrase();

// Generate address to receive coins(shoud be recorded for looking up later)
cryptoo.createAddress();

// Fires when an unconfirmed transaction is received to your address
cryptoo.on('unconfirmedTx', ({ address, txHash, value }) => {
  console.log(`saw tx ${value} for ${address}`);
});

// Fires when a transaction to your address has one confirmation
cryptoo.on('confirmedTx', ({ address, txHash, value }) => {
  console.log(`received ${value} for ${address}`);
});
```

## Configuration
```js
new Cryptoo({
  network: 'main', // default 'main', can also be 'testnet'
  chainDataFolder: '~/.bcoin', // default '~/.bcoin', where to store blockchain and wallet data
  apiKey: 'v8ZgxMBicQKsPd1jmUQY2WBfrmK4tVMfAiSCh6xZXVMcNoDoyjLDRKe', // default: none, apiKey is used to protect your wallet api, so if you open port 8332 accedently, other people is not able to access you wallet
  logBcoinLogInConsole: false, // default: false, wether to show bcoin log in console, useful for debuging
});
```

## About Security

1. close 8332 port: for now cryptoo is a wrapper on 
2. define a complex api-key: if you are not able to close 8332 port, you should define a complex api-key

## Access your bitcoins

- Mycelium
- Copay(not able to recover wallet from phrase for testnet)

## How does cryptoo work

All the major functionlites of Cryptoo is provided by [bcoin](), Cryptoo is a simple wrapper over [bcoin](), exposing necessary apis to provide an easier api interface for user to build a payment system. It's ~160 lines of code.
