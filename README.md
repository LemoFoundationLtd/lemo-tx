# LemoTx

[![npm](https://img.shields.io/npm/v/lemo-tx.svg?style=flat-square)](https://www.npmjs.com/package/lemo-tx)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-tx.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-tx)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-tx/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-tx?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-tx/blob/master/LICENSE)

A tool for creating, manipulating and signing LemoChain transactions.

## Installing

### Using Yarn

```bash
yarn add lemo-tx
```

### As Browser module

* Include `lemo-tx.min.js` in your html file.
* Use the `LemoTx` object directly from global namespace

## Example

```js
const LemoTx = require('lemo-tx')
const tx = new LemoTx({
    chainID: 1, 
    from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
    to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34',
    amount: 100,
})

console.log(tx.toString())
// {"type":"0","version":"1","chainID":"1","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"3000000000","gasLimit":"2000000","amount":"100","expirationTime":"1566886054","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","sigs":[],"gasPayerSigs":[]}
```

## LemoTx API

API | description
---|---
[new LemoTx(txInfo)](#tx-sign) | Create a transaction 
[tx.signWith(privateKey)](#tx-signWith) | Sign transaction 
[tx.hash()](#tx-hash) | Calculate hash of the transaction 
[tx.toString()](#tx-toString) | Format transaction to json string 

Static Properties | description
---|---
[LemoTx.sign(privakey, txConfig)](#tx-sign) | Sign transaction
[LemoTx.createVote(txInfo)](#tx-createVote) | Create a special transaction for vote
[LemoTx.createCandidate(txInfo, candidateInfo)](#tx-createCandidate) | Create a special transaction for register/edit candidate
[LemoTx.createAsset(txConfig, createAssetInfo)](#tx-createAsset) | Create a special transaction for create candidate
[LemoTx.createIssueAsset(txConfig, issueAssetInfo)](#tx-createIssueAsset) | Create a special transaction for the issuance of asset
[LemoTx.createReplenishAsset(txConfig, replenishInfo)](#tx-createReplenishAsset) | Create a special transaction for replenish asset
[LemoTx.createModifyAsset(txConfig, modifyInfo)](#tx-createModifyAsset) | Create a special transaction for modify asset
[LemoTx.createTransferAsset(txConfig, transferAssetInfo)](#tx-createTransferAsset) | Create a special transaction for transfer asset
[LemoTx.createNoGas(txConfig, gasPayer)](#tx-createNoGas) | Create a special transaction for free gas
[LemoTx.createReimbursement(noGasTxStr, gasPrice, gasLimit)](#tx-createReimbursement) | Create a special transaction for gas reimbursement
[LemoTx.createCreateTempAddress(txConfig, userId)](#tx-createCreateTempAddress) | Create a special transaction for create temp account 
[LemoTx.createModifySigners(txConfig, signer)](#tx-createModifySigners) | Create a special transaction for modify multiple signer
[LemoTx.createBoxTx(txConfig, subTxList)](#tx-createBoxTx) | Create a special transaction for box transaction
[LemoTx.createContractCreation(txConfig, code, constructorArgs)](#tx-createContractCreation) | Create a special transaction for contract creation
[LemoTx.TxType](#class-TxType) | Enum of transaction type

---

### Data structure

<a name="data-structure-transaction"></a>
#### transaction
Signed transaction
```json
{
  "type": "1",
  "chainID": "1",
  "version": "1",
  "from": "Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D",
  "to": "Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY",
  "gasPayer": "",
  "toName": "",
  "amount": "100",
  "data": "0x",
  "expirationTime": 1541566996,
  "gasLimit": 2000000,
  "gasPrice": "3000000000",
  "hash": "0x6d3062a9f5d4400b2002b436bc69485449891c83e23bf9e27229234da5b25dcf",
  "message": "",
  "sigs": ["0xd9a9f9f41ea020185a6480fe6938d776f0a675d89057c071fc890e09742a4dd96edb9d48c9978c2f12fbde0d0445f2ff5f08a448b91469511c663567d0b015f601"],
  "gasPayerSigs": ["0x800be6a0cf31ab9e86d547fb8cf964339276233a2b260ad8a4b4c93b39a48d6b1761e125f601bc6953e30eaad3e698c12add332a5740f1618915c12432dc610601"]
}
```
- `type` The type of transaction
- `chainID` The LemoChain id. `1` for main net and `100` for dev net
- `version` Current transaction version, Between 0 and 128
- `from` Sender address.
- `to` Recipient address
- `gasPayer` Account address of gas reimbursement agent
- `toName` (optional) Recipient name. It will be checked with `to` for safe. The max limit of length is 100.
- `amount` Amount in `mo`. It is a `BigNumber` object. 1`LEMO`=1000000000000000000`mo`=1e18`mo`
- `data` (optional) The extra data. It usually using for calling smart contract. It depends on `type` that how to using this field
- `expirationTime` The expiration time of transaction in seconds. If a transaction's expiration time is more than half hour from now, it may not be packaged in block. It depends on the transactions picking logic from miner
- `gasLimit` Max gas limit of transaction. The transaction will be fail if it cost more gas than gasLimit. And the gas will not be refunded
- `gasPrice` Price of every gas in `mo`. It is a `BigNumber` object. The more gas price the more priority
- `hash` Transaction hash
- `message` (optional) Extra text message from sender. The max limit of length is 1024.
- `sigs` Transaction signature array, each field length is 65 bytes
- `gasPayerSigs` An array of paid gas transaction signature data, each field length is 65 bytes

<a name="data-transaction-type"></a>

transaction type | number value | description
---|---|---
LemoTx.TxType.ORDINARY | 0 | Normal transaction or smart contract execution transaction
LemoTx.TxType.CREATE_CONTRACT | 1 | Create contract
LemoTx.TxType.VOTE | 2 | Set vote target
LemoTx.TxType.CANDIDATE | 3 | Register or modify candidate information
LemoTx.TxType.CREATE_ASSET | 4 | Create asset information
LemoTx.TxType.ISSUE_ASSET | 5 | Issue asset
LemoTx.TxType.REPLENISH_ASSET | 6 | Replenish asset transaction
LemoTx.TxType.MODIFY_ASSET | 7 | Modify asset transaction
LemoTx.TxType.TRANSFER_ASSET | 8 | Transfer assets
LemoTx.TxType.MODIFY_SIGNER | 9 | Modify account signers
LemoTx.TxType.BOX_TX | 10 | Package multiple transactions and run them transactional

chainID | description
---|---
1 | LemoChain main net
100 | LemoChain test net

<a name="data-structure-asset"></a>
#### asset
Asset information
```json
{
    "category": "1",
    "decimal": 18,
    "totalSupply": "15000000000000000000",
    "isReplenishable": true,
    "isDivisible": true,
    "issuer": "Lemo83GWNWJQ3DQFN6F24WFZF5TGQ39A696GJ7Z3",
    "profile": {
        "name": "Demo Asset",
        "symbol": "DT",
        "description": "this is a asset information",
        "suggestedGasLimit": "60000",
        "freeze": "false"
    }
}
```
- `category` Asset type
- `decimal` The decimal place of the issued asset, which indicates how many digits are reduced to the decimal point. The default is 18 digits. Decimal cannot be greater than 18
- `totalSupply` The total amount of assets issued, when the assets are issued and destroyed, the total amount of assets will change in real time, the total amount of assets issued is `issuance*10^decimal`
- `isReplenishable` Whether the asset can be replenish. It is not changeable after setup when creating the asset. The default is `true`
- `isDivisible` Whether the asset is divisible, set when the asset is created, the default is `true`
- `issuer` The publisher address. It is not settable
- `profile` Additional information about the asset
    - `name` The name of the asset
    - `symbol` Asset identification
    - `description` Basic information of assets
    - `suggesteGasLimit` Suggested gas limit. It is like the `gasLimit` field in transaction. The default is 60000
    - `freeze` Whether to freeze asset. The default is false. Set it to true will stop all actions about the asset except query operations

<a name="data-asset-category"></a>
#### asset category
| category| description    |
| ------- | -------------- |
| 1       | TokenAsset. Similar to Ethereum's ERC20 token. The issuer can decide whether additional issuance is allowed in the future when issuing. The token is divisible.
| 2       | NonFungibleAsset. Similar to Ethereum's ERC721 token, it can store a certain amount of information. Every token is indivisible.
| 3       | CommonAsset. More flexible digital assets. It is suitable for more complex scenarios. Actualy, the TokenAsset and NonFungibleAsset are two special CommonAsset.

---

### tx API

<a name="Constructor"></a>
#### Constructor transaction
```
tx = new LemoTx({
    chainID: 1, 
    from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
    to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34',
    amount: 100,
})
```
- `type` - (number) (optional) Transaction type. Default value is `0`
- `chainID` - (number) The LemoChain id. `1` for main net and `100` for dev net
- `version` - (number) (optional) Transaction encode version. Default value is `0`
- `to` - (string) (optional) Recipient address. Empty `to` represents a contract creation transaction with contract code in `data` field
- `toName` - (string) (optional) Recipient name. It will be checked with `to` for safe
- `amount` - (number|string) (optional) Amount in `mo`. Default value is `0`
- `gasPrice` - (number|string) (optional) Max gas limit of transaction. Default value is `3000000000`
- `gasLimit` - (number|string) (optional) Price of every gas in `mo`. Default value is `2000000`
- `data` - (Buffer|string) (optional) The extra data. It usually be using for calling smart contract
- `expirationTime` - (number|string) (optional) The expiration time of transaction in seconds. Default is half hour from now
- `message` - (string) (optional) Extra text message from sender

---

<a name="tx-signWith"></a>
#### tx.signWith
```
tx.signWith(privateKey, txInfo)
```
Sign transaction and return the signed transaction string  
The API is used for implement safety offline transaction:
1. Sign transaction on a offline device
2. Copy the output string ( untamable ) to a online device
3. Call the send method in [`lemo-client`](https://github.com/LemoFoundationLtd/lemo-client) to [`send`](https://github.com/LemoFoundationLtd/lemo-client#submodule-tx-send) the transaction to LemoChain

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor)

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const tx = new LemoTx({from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100})
const signedTxStr = tx.signWith('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52')
console.log(signedTxStr.toString())
// {"type":"0","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"100","expirationTime":"1560244840","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","sigs":["0x55fe70309bb74aaad62a7fe4ab4085dd8c8bd450ce9eab8dd7906cc5453cbaab500f50e1d05ff746248bc806f4738be2fcaafc78a557edf1e34c976a21d6f0c200"],"gasPayerSigs":[]}
```

---

### static API

<a name="tx-sign"></a>
#### LemoTx.sign
```
LemoTx.sign(privakey, txConfig)
```
Sign transaction and return the signed transaction string  
The API is used for implement safety offline transaction:
1. Sign transaction on a offline device
2. Copy the output string ( untamable ) to a online device
3. Call the send method in [`lemo-client`](https://github.com/LemoFoundationLtd/lemo-client) to [`send`](https://github.com/LemoFoundationLtd/lemo-client#submodule-tx-send) the transaction to LemoChain

##### Parameters
0. `string` - Account private key
1. `object` - Unsigned transaction

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const code = '0x000000100000100'
const constructorArgs = '213313'
const unsignedTx = LemoTx.createContractCreation(txInfo, code, constructorArgs)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', unsignedTx)
console.log(signedTxStr) // {"type":"1","version":"1","chainID":"1","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"3000000000","gasLimit":"2000000","amount":"100","expirationTime":"1567152222","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","data":"0x0000001000001003313","sigs":["0xd897e25a640dda2d56ecb986c7b4c0dc835fd5131a434a5f5ca0ee1cd9caf8dc292dc4cefc9242c41a6e7976e000d66113232ff347e4db963dbaf70896fb27de00"],"gasPayerSigs":[]}
// Call the send method in lemo-client, lemo.send(signTx)
```


<a name="tx-createVote"></a>
#### LemoTx.createVote
```
LemoTx.createVote(txInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for vote. The API fills some special information in the `data` filed in LemoTx instance  

##### Parameters
`object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to` means vote target. And `amount`, `data` fields will be ignored. 

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const txInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const tx = LemoTx.crateVote(txInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createCandidate"></a>
#### LemoTx.createCandidate
```
LemoTx.createCandidate(txInfo, candidateInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for candidate. The API fills some special information in the `data` filed in LemoTx instance    

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to`, `toName`, `amount`, `data` fields will be ignored. 
1. `object` - Candidate information. It is same with `candidate.profile` in [account](#data-structure-account)

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const candidateInfo = {
    isCandidate: true,
    minerAddress: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
    host: '127.0.0.1',
    port: '7001',
    introduction: 'this is a demo',
}
const tx = LemoTx.createCandidate(txInfo, candidateInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createAsset"></a>
#### LemoTx.createAsset
```
LemoTx.createAsset(txConfig, createAssetInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for create assets. The API fills some special information in the `data` filed in LemoTx instance    

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to`, `amount`, `toName`fields will be ignored. 
1. `object` - Create of [assets](#data-structure-asset) information.

##### Returns
`LemoTx` - Unsigned LemoTx instance, `data` contains the information for create the asset

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const createAssetInfo = {
    category: 1,
    decimal: 18,
    isReplenishable: true,
    isDivisible: true,
    profile: {
        name: 'Demo Asset',
        symbol: 'DT',
        description: 'demo asset',
        suggestedGasLimit: '60000',
    },
}
const tx = LemoTx.createAsset(txInfo, createAssetInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)  
```

---

<a name="tx-createIssueAsset"></a>
#### LemoTx.createIssueAsset
```
LemoTx.createIssueAsset(txConfig, issueAssetInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for the issuance of assets. The API fills some special information in the `data` filed in LemoTx instance    

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to`, `toName`, `amount`, `data` fields will be ignored. 
1. `object` - Transfer of assets information. includes `assetCode`, `metaData`, `supplyAmount` field

##### Returns
`LemoTx` - Unsigned LemoTx instance, `data` contains the information for issue the asset

##### Example
```js
const txInfo = {chainID: 1,to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const issueAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    metaData: 'issue asset metaData',
    supplyAmount: '100000',
}
const tx = LemoTx.createIssueAsset(txInfo, issueAssetInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createReplenishAsset"></a>
#### LemoTx.createReplenishAsset
```
LemoTx.createReplenishAsset(txConfig, replenishInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for replenish assets. The API fills some special information in the `data` filed in LemoTx instance     

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `amount` field will be ignored.
1. `object` - Replenish assets information. includes `assetID`, `replenishAmount` fields

##### Returns
`LemoTx` - Unsigned LemoTx instance, `data` contains the information for replenish the asset

##### Example
```js
const txInfo = {chainID: 1, to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const replenishAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    replenishAmount: '100000',
}
const tx = LemoTx.createReplenishAsset(txInfo, replenishAssetInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createModifyAsset"></a>
#### LemoTx.createModifyAsset
```
LemoTx.createModifyAsset(txConfig, modifyInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for modify assets. The API fills some special information in the `data` filed in LemoTx instance    

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).  For this API, `amount`, `to`, `toName` fields will be ignored.
1. `object` - Assets modification information. It contains `assetCode` and `info` fields. The `info` contains the fields you want to modify, such as `name`, `symbol`, `description`, `freeze`, `suggestedGasLimit`.

##### Returns
`LemoTx` - Unsigned LemoTx instance, `data` contains the information for modify the asset

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const ModifyAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    updateProfile: {
        name: 'Demo Asset',
        symbol: 'DT',
        description: 'demo asset',
    },
}
const tx = LemoTx.createModifyAsset(txInfo, ModifyAssetInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createTransferAsset"></a>
#### LemoTx.createTransferAsset
```
LemoTx.createTransferAsset(txConfig, transferAssetInfo)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for transaction assets. The API fills some special information in the `data` filed in LemoTx instance    

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).
1. `object` - Transaction assets information. includes `assetID` field

##### Returns
`LemoTx` - Unsigned LemoTx instance, `data` contains the information for transfer the asset

##### Example
```js
const txInfo = {chainID: 1, to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const transferAsset = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    transferAmount: '110000',
}
const tx = LemoTx.createTransferAsset(txInfo, transferAsset)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createNoGas"></a>
#### LemoTx.createNoGas
```
LemoTx.createNoGas(txConfig, gasPayer)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for gas free transaction. The API fills some special information in the `data` filed in LemoTx instance    
1. Create a gas free transaction with transaction information and `gasPayer` account address. The transaction information is exclude `gasLimit` and `gasPrice` field
2. Send the output string to gas gasPayer
3. The gasPayer sign the string with his private key, fill `gasLimit` and `gasPrice` field. Then return a final transaction string
4. Call the send method in [`lemo-client`](https://github.com/LemoFoundationLtd/lemo-client) to [`send`](https://github.com/LemoFoundationLtd/lemo-client#submodule-tx-send) the transaction to LemoChain

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `gasLimit`, `gasPrice` fields will be ignored.
1. `string` - The address of gas gasPayer account.

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const txInfo = {chainID: 1, to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const gasPayer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const tx = LemoTx.createNoGas(txInfo, gasPayer)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
```

---

<a name="tx-createReimbursement"></a>
#### LemoTx.createReimbursement
```
LemoTx.createReimbursement(noGasTxStr, gasPrice, gasLimit)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for paying gas to a free gas transaction. The API fills some special information in the `data` filed in LemoTx instance    

##### Parameters
0. `string` - The string returned by the [`tx.signNoGas`](#tx-signNoGas) method,  See [`tx.signNoGas`](#tx-signNoGas)  
1. `string` - Price of every gas in `mo`.
2. `string` - Max gas limit of transaction.

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const txInfo = {chainID: 1, to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const gasPayer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const noGasInfo = LemoTx.createNoGas(txInfo, gasPayer)
const tx = LemoTx.createReimbursement(noGasInfo, 2, 100)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createCreateTempAddress"></a>
#### LemoTx.createCreateTempAddress
```
LemoTx.createCreateTempAddress(txConfig, userId)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for create temp account transaction. The API fills some special information in the `data` filed in LemoTx instance     
1. Temp account has no private key and only can be signed by accounts in its `signers`
2. Temp account must be configured with Signers before using it
3. If the temp account already exists, the creation will be fail  

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).
1. `string` - customized user id, which's length should be 10 bytes in hexadecimal at most

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const userId = '0123456789'
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const tx = LemoTx.createTempAddress(txInfo, userId)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createModifySigners"></a>
#### LemoTx.createModifySigners
```
LemoTx.createModifySigners(txConfig, signers)
```
Create the transaction of the signers in the multi-signer account, the API fills some special information in the `data` filed in LemoTx instance  

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).
1. `array` - Modified multiple signers list containing the fields `address` and `weight`

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const signers = [{
            address: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            weight: 50,
        }, {
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            weight: 50,
        }]
const txInfo = {chianID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const tx = LemoTx.createModifySigners(txInfo, signers)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createBoxTx"></a>
#### LemoTx.createBoxTx
```
LemoTx.createBoxTx(txConfig, subTxList) 
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for box transactions,   
The API fills some special information in the `data` filed in LemoTx instance  
1. Box transaction can store multiple signed transaction informations including special transactions, but cannot store box transactions
2. The timestamp of the box transaction is equal to the minimum timestamp of the child transaction in the box
3. The neutron in the box transactions will succeed or fail at the same time, if one of the sub-transaction does not succeed then all the transactions in the box trade will fail  
4. The sub-transaction of the box transaction must be signed transaction

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to` fields will be ignored.
1. `array` - Signed transaction list. The item should by signed transaction string or object

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const createTempAddressInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const createTempAddress = LemoTx.createTempAddress(createTempAddressInfo, '0123456789')
const signTempAddress = LemoTx.sign(testPrivate, createTempAddress)

const transferAssetInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const transferAsset = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    transferAmount: '110000',
}
const createTransferAsset = LemoTx.createTransferAsset(transferAssetInfo, transferAsset)
const signTransferAsset = LemoTx.sign(testPrivate, createTransferAsset)

const subTxList = [signTempAddress, signTransferAsset]
const tx = LemoTx.createBoxTx({chainID: '1', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}, subTxList)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

<a name="tx-createContractCreation"></a>
#### LemoTx.createContractCreation
```
LemoTx.createContractCreation(txConfig, code, constructorArgs)
```
Create an unsigned LemoTx [`instance`](#tx-constructor) for contract creation    
The API fills some special information in the `data` filed in LemoTx instance  

##### Parameters
0. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). 
1. `string` - The hexadecimal string of the contract code
2. `string` - The hexadecimal string of a parameter constructed in the contract

##### Returns
`LemoTx` - Unsigned LemoTx instance

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const code = '0x000000100000100'
const constructorArgs = '213313'
const tx = LemoTx.createContractCreation(txInfo, code, constructorArgs)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// Call the send method in lemo-client, lemo.send(signTx)
```

---

### other API

<a name="tool-TxType"></a>

#### LemoTx.TxType

```
LemoTx.TxType
```

Enum of [transaction type](#data-transaction-type), the value is `number` type

##### Example

```js
console.log(LemoTx.TxType.VOTE) // 1
```

---


## Developing

### Requirements

* Node.js
* yarn

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install yarn
```

### Building

```bash
yarn build
```

### Testing

```bash
yarn test
```

## Licensing

LGPL-3.0
