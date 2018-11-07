const Cryptoo = require('../src');

const cryptoo = new Cryptoo({
  network: 'testnet',
  chainDataFolder: '~/.bcoin',
  secret: 'sample-secret-e34dc9dff1b8b04c2b678ff7bb1dd02181bfe31b045f77',
});

cryptoo.createAddress()
  .then(address => console.log(`\nPayment address: ${address}`));

cryptoo.getRecoveryPhrase()
  .then(recoveryPhrase => console.log(`\nWallet recovery phrase: ${recoveryPhrase}`));


// send some bitcoins to the address to see the transctions after blockchain data is synced
cryptoo.on('unconfirmedTx', (data) => {
  console.log(data, 'unconfirmedTx');
});

cryptoo.on('confirmedTx', (data) => {
  console.log(data, 'confirmedTx');
});
