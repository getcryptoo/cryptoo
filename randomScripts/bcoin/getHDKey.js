let id;
id='primary'
const {WalletClient} = require('bclient');
const {Network} = require('bcoin');
const network = Network.get('testnet');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  // apiKey: 'api-key'
}

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

(async () => {
  const result = await wallet.getMaster();
  console.log(result);
})();
