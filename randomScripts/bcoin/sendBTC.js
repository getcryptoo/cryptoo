// Usage: refound; swap out money
let id; let passphrase; let rate; let value; let
  address;
id = 'primary';
// passphrase = 'secret123';
rate = 1000;
value = 10000;
address = 'moR6DrHWZJUDrxTTsSDdC4KXrML7osrp7K';

const { WalletClient } = require('bclient');
const { Network } = require('bcoin');

const network = Network.get('testnet');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  // apiKey: 'api-key',
};

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

const options = {
  // passphrase,
  rate,
  outputs: [{ value, address }],
};

(async () => {
  const result = await wallet.send(options);
  console.log(result);
})();
