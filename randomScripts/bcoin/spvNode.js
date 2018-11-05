// Get the SPV node object from the globally-installed bcoin package
const bcoin = require('bcoin');

// Configure doc: https://github.com/bcoin-org/bcoin/blob/master/docs/Configuration.md
const node = new bcoin.SPVNode({
  // prefix: './bcoinData', // Bcoin's datadir KEY ALSO THERE??? yes, so user should backup HD master key first
  network: 'testnet', // testnet; regtest; simnet
  config: true,
  argv: true,
  env: true,
  logFile: true,
  logConsole: true,
  logLevel: 'debug',
  // db: 'leveldb', // This is default
  memory: false,
  persistent: true,
  workers: true,
  listen: true,
  loader: require,
});

// Add wallet and database
node.use(bcoin.wallet.plugin);

(async () => {
  // Validate the prefix directory (probably ~/.bcoin)
  await node.ensure();
  // Open the node and all its child objects, wait for the database to load
  await node.open();
  // Connect to the network
  await node.connect();

  // add wallet database
  // const walletdb = node.require('walletdb').wdb;
  // const wallet = await walletdb.primary;

  // write new transaction details to file named by tx hash
  node.on('tx', async (tx) => {
    console.log(tx);
    // TODO: when transaction arrive, check the txes cryptoo is monitoring
    // if matches: call the webhook
  });

  node.on('block', (block) => {
    // console.log(block);
  });
  // EVENTS: http://bcoin.io/guides/events.html

  node.plugins.walletdb.wdb.on('tx', (details, a) => {
    console.log(' -- wallet tx -- \n', details, a)
  });
    // 
    node.plugins.walletdb.wdb.on('balance', (details, a) => {
      console.log(' -- wallet balance -- \n', details, a)
    });

    // see find comfirmed tx!!!!!!
    node.plugins.walletdb.wdb.on('confirmed', (details, a) => {
      console.log(' -- wallet confirmed -- \n', details, a)
    });
  
    node.plugins.walletdb.wdb.on('address', (details) => {
      console.log(' -- wallet address -- \n', details)
    });
  // Start the blockchain sync
  node.startSync();
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
