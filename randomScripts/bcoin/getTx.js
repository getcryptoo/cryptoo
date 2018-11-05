let id; let
  hash;
id = 'primary';
hash = 'e2027a3e6d7a078c39b56b08ef1961c84a14370e828975ac4163b8bbeee48b3a';
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

(async () => {
  const result = await wallet.getTX(hash);
  console.log(result);
})();
