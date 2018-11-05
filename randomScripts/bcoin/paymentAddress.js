const { Network } = require('bcoin');
const { WalletClient } = require('bclient');

const network = Network.get('testnet');

const walletOptions = {
  network: network.type,
  port: network.walletPort,
};

const walletClient = new WalletClient(walletOptions);
const wallet = walletClient.wallet('primary');

async function preparePaymentAddress({ amount, address, callbackUrl }) {
  const newReceivingAddress = await wallet.createAddress('default');
  console.log(newReceivingAddress);
  const paymentAddr = `bitcoin:${newReceivingAddress.address}?amount=${amount}`;
  console.log(paymentAddr);
  // TODO: add address to watch list
  return paymentAddr;
}

module.exports = {
  preparePaymentAddress,
};

preparePaymentAddress({
  amount: 0.0001,
});
