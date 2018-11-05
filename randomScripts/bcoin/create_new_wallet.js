// Usage: support multiple applications?
let id; let passphrase; let name; let
  type;
id = 'primary';
passphrase = 'secret123';
name = 'menace';
type = 'multisig';
const { WalletClient } = require('bclient');
const { Network } = require('bcoin');

const network = Network.get('regtest');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  apiKey: 'api-key',
};

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);
const options = { name, type, passphrase }(async () => {
  const result = await wallet.createAccount(name, options);
  console.log(result);
})();
