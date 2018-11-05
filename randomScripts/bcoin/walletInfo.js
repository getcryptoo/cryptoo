const id = 'primary';
const { WalletClient } = require('bclient');
const { Network } = require('bcoin');

const network = Network.get('testnet');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
  // apiKey: 'sample-api-key-e34dc9dff1b8b04c2b678ff7bb1dd02181bfe31b045f77',
};

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet(id);

(async () => {
  const result = await wallet.getInfo();
  const accounts = await wallet.getAccount('default');
  const allCoins = await wallet.getCoins();
  console.log(result);
  console.log(accounts);
  console.log(allCoins);
  const master = await wallet.getMaster();
  console.log(master);
})();