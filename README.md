# web3-plugin-IPFS

Web3.js Plugin for IPFS Upload and register in Contract

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Test](#test)

## Introduction

This is a `Web3.js` Plugin that have two main functions for uploading a provided local file to IPFS, then store the CID in a smart contract, and another function for listing all stored CIDs of given ethereum address.

## Installation

1. Install the required dependencies:

    ```bash
    yarn
    ```
## Usage

### Initialization

```javascript
import { Web3 } from 'web3';
import { IPFSPlugin } from 'web3-plugin-ipfs';

/**
 * Used Infura IPFS for storing files
 **/
const host = 'ipfs.infura.io:5001';
const apiKey = '';
const secret = '';

const web3Context = new Web3("https://sepolia.drpc.org");
web3.eth.accounts.wallet.add("YOUR-PRIVATE-KEY"); //this address should have some testnet eth
const ipfsPlugin = new IPFSPlugin({
  ipfsHost: host,
  ipfsApiKey: apiKey,
  ipfsSecretKey: secret,
});

web3Context.registerPlugin(ipfsPlugin);
```

### Upload File and Send Transaction
    
```javascript
const filePath = 'path/to/your/file.txt';
try {
    const tx = await web3Context.ipfs.uploadFileAndSendTransaction(filePath);
    console.log('Transaction:', tx);
} catch (error) {
    console.error('Error:', error.message);
}
```

### Get CID Events by Address

```javascript
const address = 'your-ethereum-address';

try {
  const events = await web3Context.ipfs.getCidEventsByAddress(address);
  console.log('CID Events:', events);
} catch (error) {
  console.error('Error:', error.message);
}
```
## Test

- In tests we are using `Sepolia` network with RPC: `https://sepolia.drpc.org`
- Their are few test `sepoliaEth` in `0x8c3769767392647636b8613c510df9a2616b15f97d8a56658f322cd034b8f905` for testing, or you can use your own test account.
```bash
yarn test
```
