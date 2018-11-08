const bcoin = require('bcoin');
const { WalletClient, NodeClient } = require('bclient');
const EventEmitter = require('events');
const assert = require('assert');

class Cryptoo extends EventEmitter {
  /**
   * Create Cyptoo instace
   * @constructor
   * @param {Object} options
   * @param {String} [options.secret] apiKey to protect bcoin http endpoints
   * @param {String} [options.network="main"] default: "main"; bitcoin network: 'main' or 'testnet'
   * @param {String} [options.chainDataFolder="~/.bcoin"]
   *    default: "~/.bcoin"; folder to store bcoin blockchain data
   * @param {Boolean} [options.logBcoinLogInConsole=false] whether print bcoin log in console
   */
  constructor(options) {
    super();

    const {
      secret,
      network = 'main',
      logBcoinLogInConsole = false,
      chainDataFolder = '~/.bcoin',
    } = options;

    assert(network === 'main' || network === 'testnet', 'network can only be "main" or "testnet"');
    assert(typeof logBcoinLogInConsole === 'boolean', 'logBcoinLogInConsole should be Boolean type');

    this.network = network;

    // Ref: https://github.com/bcoin-org/bcoin/blob/master/docs/Configuration.md
    this.node = new bcoin.SPVNode({
      network, // testnet; main;
      apiKey: secret,
      logConsole: logBcoinLogInConsole,
      prefix: chainDataFolder,
      config: true,
      argv: true,
      env: true,
      logFile: true,
      logLevel: 'debug',
      memory: false,
      persistent: true,
      workers: true,
      listen: true,
      loader: require,
    });

    const walletClient = new WalletClient({
      network: bcoin.Network.get(network).type,
      port: bcoin.Network.get(network).walletPort,
      apiKey: secret,
    });

    this.nodeClient = new NodeClient({
      network: bcoin.Network.get(network).type,
      port: bcoin.Network.get(network).rpcPort,
      apiKey: secret,
    });

    this.wallet = walletClient.wallet('primary');
    this._initialized = this._init();
  }

  /**
   * Initialize the node.
   */
  async _init() {
    // Add wallet and database
    this.node.use(bcoin.wallet.plugin);
    // Validate the prefix directory (probably ~/.bcoin)
    await this.node.ensure();
    // Open the node and all its child objects, wait for the database to load
    await this.node.open();
    // Connect to the network
    await this.node.connect();


    const chainInfo = await this.nodeClient.getInfo();

    console.log(`[cryptoo]: syncing blockchain data: ${(chainInfo.chain.progress * 100).toFixed(3)}%`);

    // ref: https://bitcointalk.org/index.php?topic=2966580.0
    const genesisBlockTime = this.network === 'main' ? 1231006505 : 1296688602;
    const currentTime = Math.floor(Date.now() / 1000);

    this.node.on('connect', async (entry) => {
      const blockTime = entry.time;
      const progress = Math.min(
        1,
        (blockTime - genesisBlockTime) / (currentTime - genesisBlockTime - 40 * 60),
      );

      console.log(`[cryptoo]: syncing blockchain data: ${(progress * 100).toFixed(3)}%`);
    });

    this.node.plugins.walletdb.wdb.on('tx', async (wallet, tx) => {
      const receivedOutputs = await this._getReceivedOutputs(tx);
      receivedOutputs.forEach(output => this.emit('unconfirmedTx', output));
    });

    this.node.plugins.walletdb.wdb.on('confirmed', async (wallet, tx) => {
      const receivedOutputs = await this._getReceivedOutputs(tx);
      receivedOutputs.forEach(output => this.emit('confirmedTx', output));
    });

    this.node.startSync();
  }

  async _getReceivedOutputs(tx) {
    const txHash = tx.txid();
    const txGotByClient = await this.wallet.getTX(txHash);
    return txGotByClient.outputs
      .filter(output => output.path)
      .map(output => ({
        txHash,
        address: output.address,
        value: output.value,
      }));
  }

  /**
   * create a new address used to accept BTC
   */
  async createAddress() {
    await this._initialized;
    const addr = await this.wallet.createAddress('default');
    return addr.address;
  }

  /**
   * get recovery phrase
   */
  async getRecoveryPhrase() {
    await this._initialized;
    const master = await this.wallet.getMaster();
    return master.mnemonic.phrase;
  }
}

module.exports = Cryptoo;
