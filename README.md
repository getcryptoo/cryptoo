## Cryptoo

Set up your own bitcoin payment system the easy way(with 4 APIs).

## Usage

```js
const Cryptoo = require('cryptoo');

// Create a cryptoo instance
// Start syncing blockchain data
const cryptoo = new Cryptoo({
  secret: 'sample-secret-e34dc9dff1b8b04c2b678ff7bb1dd02181bfe31b045f77',
});

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
  // default 'main', can also be 'testnet'
  network: 'main',
  // default '~/.bcoin', where to store blockchain and wallet data
  chainDataFolder: '~/.bcoin',
  // default: null, secret is used to protect your wallet api, so that if you open port 8332 accedently, other people wll not be able to access you wallet
  secret: 'v8ZgxMBicQKsPd1jmUQY2WBfrmK4tVMfAiSCh6xZXVMcNoDoyjLDRKe',
  // default: false, wether to show bcoin log in console, useful for debuging
  logBcoinLogInConsole: false,
});
```

## Real-life examples

- [Cryptoo landing page with bitcoin donation](https://getcryptoo.com); [[source code]](https://github.com/getcryptoo/cryptoo-example)
- TO BE ADDED

## How does cryptoo work

All the major functionlites of Cryptoo is provided by [bcoin](https://github.com/bcoin-org/bcoin), Cryptoo is a simple wrapper over [bcoin](https://github.com/bcoin-org/bcoin), exposing necessary apis to provide an easier api interface for user to build a payment system. It's about 160 lines of code.

Bcoin is able to start and mantain bitcoin [SPV node](https://bitcoin.org/en/operating-modes-guide#simplified-payment-verification-spv)(light weight node) and also [HD wallet](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)(able to derive unlimited addresses from a seed key(recovery phrase))

When `Cryptoo` instance is created, it will start an SPV node and prepare an HD wallet for you.

## About Security

1. **Close 8332 port**: for now cryptoo is a wrapper on bcoin, and bcoin will start an http server listening on this port for accessing wallet data, it's recommand to disable 8332 port for external access.
2. **Define a complex api-key**: if you are not able to close 8332 port, you should define a complex api-key

## Access your bitcoins

As the wallet provided is an HD wallet, once you get the recovery phrase by invoking the `getRecoveryPhrase()` API. You can access you wallet by importing it to any wallet support bip44

### Recommend HD wallets
- [Mycelium](https://wallet.mycelium.com/)
- [Copay](https://copay.io/)(not able to recover wallet from phrase for testnet)

## Roadmap

- cryptoo-eth

### Useful tools
- faucet testnet bitcoin: http://bitcoinfaucet.uo1.net/send.php