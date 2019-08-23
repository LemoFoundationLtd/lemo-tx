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
[LemoTx.signVote(privateKey, txInfo)](#tx-signVote) | Sign a special transaction for vote
[LemoTx.signCandidate(privateKey, txInfo, candidateInfo)](#tx-signCandidate) | Sign a special transaction for register/edit candidate
[LemoTx.signCreateAsset(privateKey, txConfig, createAssetInfo)](#tx-signCreateAsset) | Sign a special transaction for create candidate
[LemoTx.signIssueAsset(privateKey, txConfig, issueAssetInfo)](#tx-signIssueAsset) | Sign a special transaction for the issuance of asset
[LemoTx.signReplenishAsset(privateKey, txConfig, replenishInfo)](#tx-signReplenishAsset) | Sign a special transaction for replenish asset
[LemoTx.signModifyAsset(privateKey, txConfig, modifyInfo)](#tx-signModifyAsset) | Sign a special transaction for modify asset
[LemoTx.signTransferAsset(privateKey, txConfig, transferAssetInfo)](#tx-signTransferAsset) | Sign a special transaction for transfer asset
[LemoTx.signNoGas(privateKey, txConfig, gasPayer)](#tx-signNoGas) | Sign a special transaction for free gas
[LemoTx.signReimbursement(privateKey, noGasTxStr, gasPrice, gasLimit)](#tx-signReimbursement) | Sign a special transaction for gas reimbursement
[LemoTx.signCreateTempAddress(privateKey, txConfig, userId)](#tx-signCreateTempAddress) | Sign a special transaction for create temp account 
[LemoTx.signModifySigners(privateKey, txConfig, signer)](#tx-signModifySigners) | Sign a special transaction for modify multiple signer| ✖ | ✓ 
[LemoTx.signBoxTx(privateKey, txConfig, subTxList)](#tx-signBoxTx) | Sign a special transaction for box transaction
[LemoTx.signContractCreation(privateKey, txConfig, code, constructorArgs)](#tx-signContractCreation) | Sign a special transaction for contract creation
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
- `1` TokenAsset. Similar to Ethereum's ERC20 token. The issuer can decide whether additional issuance is allowed in the future when issuing. The token is divisible.
- `2` NonFungibleAsset. Similar to Ethereum's ERC721 token, it can store a certain amount of information. Every token is indivisible.
- `3` CommonAsset. More flexible digital assets. It is suitable for more complex scenarios. Actualy, the TokenAsset and NonFungibleAsset are two special CommonAsset.

---

### tx API

<a name="Constructor"></a>
#### Constructor
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
3. Call [`tx.send`](#tx-send) to send the transaction to LemoChain

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor)

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const tx = new LemoTx({from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100})
const signedTxStr = tx.signWith('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52')
console.log(signedTxStr)
// {"type":"0","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"100","expirationTime":"1560244840","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","sigs":["0x55fe70309bb74aaad62a7fe4ab4085dd8c8bd450ce9eab8dd7906cc5453cbaab500f50e1d05ff746248bc806f4738be2fcaafc78a557edf1e34c976a21d6f0c200"],"gasPayerSigs":[]}
```

---

### static API

<a name="LemoTx-signVote"></a>
#### LemoTx.signVote
```
tx.signVote(privateKey, txInfo)
```
Sign a transaction for vote and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to` means vote target. And `amount`, `data` fields will be ignored. 

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const signedTxStr = LemoTx.signVote('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo)
console.log(signedTxStr)
// {"type":"2","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245016","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","sigs":["0xb2da1259549fe88d0b74f0605ba0cf4d5412bf1364ea07d3b1f401e7ef3227743f30f268c90f87b2381195f2527b2fe415476eb91e9fb494d4ced9aec4791a7900"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signCandidate"></a>
#### LemoTx.signCandidate
```
tx.signCandidate(privateKey, txInfo, candidateInfo)
```
Sign a transaction for register/edit candidate and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to`, `toName`, `amount`, `data` fields will be ignored. 
3. `object` - Candidate information. It is same with `candidate.profile` in [account](#data-structure-account)

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {chainID: '1', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const candidateInfo = {
    isCandidate: true,
    minerAddress: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    nodeID: '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
    host: '127.0.0.1',
    port: '7001',
}
const signedTxStr = LemoTx.signCandidate('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', txInfo, candidateInfo)
console.log(signedTxStr)
// {"type":"3","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245128","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","data":"0x7b22697343616e646964617465223a2274727565222c226d696e657241646472657373223a224c656d6f3833474e3732475948324e5a3842413732395a39544354374b5135464333435236444a47222c226e6f64654944223a223565333630303735356639623531326136353630336233386533303838356339386362616337303235396333323335633962336634326565353633623438306564656133353162613066663537343861363338666530616566663564383435626633376133623433373833313837316234386664333266333363643961336330222c22686f7374223a223132372e302e302e31222c22706f7274223a2237303031227d","sigs":["0x90cb4d6d6699da110d401dd452ca2a93318312845ba1f5dcb7a07aab621acc7e408e7dc53ab2c9d4dbd2c6b1db54ff4d0128f215a2380337a8b0ce9da5557f3701"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signCreateAsset"></a>
#### LemoTx.signCreateAsset
```
tx.signCreateAsset(privateKey, txConfig, createAssetInfo)
```
Sign a transaction for create assets and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to`, `amount`, `toName`fields will be ignored. 
3. `object` - Create of [assets](#data-structure-asset) information.

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information, `data` contains the information for create the asset

##### Example
```js
const txInfo = {chainID: '1', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
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
const signCreateAsset = LemoTx.signCreateAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, createAssetInfo)
console.log(signCreateAsset)
// {"type":"4","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245285","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","data":"0x7b2263617465676f7279223a312c22646563696d616c223a31382c2269735265706c656e69736861626c65223a747275652c226973446976697369626c65223a747275652c2270726f66696c65223a7b226e616d65223a2244656d6f204173736574222c2273796d626f6c223a224454222c226465736372697074696f6e223a2264656d6f206173736574222c227375676765737465644761734c696d6974223a223630303030222c22667265657a65223a2266616c7365227d7d","sigs":["0x60fa169322999ebf3c40d6165faa527f9570eaaa7d31dd881d7075af94c3efa42a330e2fa35053960d954853ea118cac7e4fad9c29c252212727c782368fbce300"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signIssueAsset"></a>
#### LemoTx.signIssueAsset
```
tx.signIssueAsset(privateKey, txConfig, issueAssetInfo)
```
Sign a transaction for the issuance of assets and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to`, `toName`, `amount`, `data` fields will be ignored. 
3. `object` - Transfer of assets information. includes `assetCode`, `metaData`, `supplyAmount` field

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information, `data` contains the information for issue the asset

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const issueAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    metaData: 'issue asset metaData',
    supplyAmount: '100000',
}
const signIssueAsset = LemoTx.signIssueAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, issueAssetInfo)
console.log(signIssueAsset)
// {"type":"5","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245347","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","data":"0x7b226173736574436f6465223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c226d65746144617461223a226973737565206173736574206d65746144617461222c22737570706c79416d6f756e74223a22313030303030227d","sigs":["0xfcaf51badd3d521c29ed3f9c5468c2724cf0f72dcb89b4fa59d97c44d0e425e90ebf20c181ccca2866f083d3af73fb9819e9ec6b2262c15d28c059700e968cb301"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signReplenishAsset"></a>
#### LemoTx.signReplenishAsset
```
tx.signReplenishAsset(privateKey, txConfig, replenishInfo)
```
Sign a transaction for replenish assets and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `amount` field will be ignored.
3. `object` - Replenish assets information. includes `assetID`, `replenishAmount` fields

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information, `data` contains the information for replenish the asset

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const replenishAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    replenishAmount: '100000',
}
const signReplenishAsset = LemoTx.signReplenishAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, replenishAssetInfo)
console.log(signReplenishAsset)
// {"type":"6","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245854","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","data":"0x7b226173736574436f6465223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c2261737365744964223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c227265706c656e697368416d6f756e74223a22313030303030227d","sigs":["0x24b06a03dc3091ecc60ddec7f07f1603336d02a4e1afe56c2800cf86ec2b96aa3c0a53ef68f6d318fc2685d5d442d98f99158df1ef000cd19a73f9352bd52d7f01"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signModifyAsset"></a>
#### LemoTx.signModifyAsset
```
tx.signModifyAsset(privateKey, txConfig, modifyInfo)
```
Sign a transaction for modify assets and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).  For this API, `amount`, `to`, `toName` fields will be ignored.
3. `object` - Assets modification information. It contains `assetCode` and `info` fields. The `info` contains the fields you want to modify, such as `name`, `symbol`, `description`, `freeze`, `suggestedGasLimit`.

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information, `data` contains the information for modify the asset

##### Example
```js
const txInfo = {chainID: '1', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const ModifyAssetInfo = {
    assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    updateProfile: {
        name: 'Demo Asset',
        symbol: 'DT',
        description: 'demo asset',
    },
}
const signModifyAsset = LemoTx.signModifyAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, ModifyAssetInfo)
console.log(signModifyAsset)
// {"type":"7","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245828","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","data":"0x7b226173736574436f6465223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c2275706461746550726f66696c65223a7b226e616d65223a2244656d6f204173736574222c2273796d626f6c223a224454222c226465736372697074696f6e223a2264656d6f206173736574227d7d","sigs":["0xae9fc8cdfbc69a5148707fc11c355bbd5e46d15d9984eee58bc13e63b7df992d6ef7e275dc4b41f890343ffa1b178985ce878a60819aa81a924986ff31a6548800"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signTransferAsset"></a>
#### LemoTx.signTransferAsset
```
tx.signTransferAsset(privateKey, txConfig, transferAssetInfo)
```
Sign a transaction for transaction assets and return the signed transaction string  
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).
3. `object` - Transaction assets information. includes `assetID` field

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information, `data` contains the information for transfer the asset

##### Example
```js
const txInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const transferAsset = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    transferAmount: '110000',
}
const signTransferAsset = LemoTx.signTransferAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, transferAsset)
console.log(signTransferAsset)
// {"type":"8","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245887","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","data":"0x7b2261737365744964223a22307864306265666433383530633537346237663661643666373934336665313962323132616666623930313632393738616463323139336130333563656438383834222c227472616e73666572416d6f756e74223a22313130303030227d","sigs":["0x1cc75fc53d20ea49c9ed6f3d3b00bcf12d570f87b148dd04973f17d0f313118d029145cb03e1ebbb6172184d72c13a9be5601968f7a595b37b3cea16a1187a8601"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signNoGas"></a>
#### LemoTx.signNoGas
```
tx.signNoGas(privateKey, txConfig, gasPayer)
```
Sign a transaction for gas free transaction and return the signed transaction string  
1. Sign a gas free transaction with transaction information and `gasPayer` account address. The transaction information is exclude `gasLimit` and `gasPrice` field
2. Send the output string to gas gasPayer
3. The gasPayer sign the string with his private key, fill `gasLimit` and `gasPrice` field. Then return a final transaction string
4. Call [`tx.send`](#tx-send) to send the transaction string to LemoChain

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `gasLimit`, `gasPrice` fields will be ignored.
3. `string` - The address of gas gasPayer account.

##### Returns
`string` - The string for [`tx.signReimbursement`](#tx-signReimbursement)

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const gasPayer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const noGasInfo = LemoTx.signNoGas('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, gasPayer)
console.log(noGasInfo)
// {"type":"0","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560245914","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","sigs":["0xa99e2f88b510ae9bcd53182bf8364b13e0682c375a282f8f942543d8dbc3146430d3cddb5e65f3f81982c4a24b6fd6053dc82df5d3eba80e9d2936449c1764e800"],"gasPayerSigs":[],"gasPayer":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D"}
```

---

<a name="LemoTx-signReimbursement"></a>
#### LemoTx.signReimbursement
```
tx.signReimbursement(privateKey, noGasTxStr, gasPrice, gasLimit)
```
Sign a gas reimbursement transaction for paying gas to a free gas transaction, then return the signed transaction string  
See [`tx.signNoGas`](#tx-signNoGas)

##### Parameters
1. `string` - Account private key
2. `string` - The string returned by the [`tx.signNoGas`](#tx-signNoGas) method
3. `string` - Price of every gas in `mo`.
4. `string` - Max gas limit of transaction.

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const gasPayer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const noGasInfo = LemoTx.signNoGas('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, gasPayer)
const result = LemoTx.signReimbursement('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', noGasInfo, 2, 100)
console.log(result)
// {"type":"0","version":"1","chainID":"1","gasPrice":"2","gasLimit":"100","amount":"0","expirationTime":"1560245965","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY","sigs":["0xf8ec13d8fb425939d00a2c97299ba57a29ae1e1fb9450e6f7a7620189d8000de1c53a9bc81e6c34138fd80dbd0959ade8e33564bdb4c9b93e9ae7edc5de7440701"],"gasPayerSigs":["0x0edb211e684bfda13969aa9115c292a485bdb43061b54148b140b97cd0322b3d7d973004d8caf0c4de3975d0d553baa6d0d7d41a6ce0d14c0b754cecb4b020a900"]}
```

---

<a name="LemoTx-signCreateTempAddress"></a>
#### LemoTx.signCreateTempAddress
```
tx.signCreateTempAddress(privateKey, txConfig, userId)
```
Sign a transaction for create temp account transaction, then return the signed transaction string  
1. Temp account has no private key and only can be signed by accounts in its `signers`
2. Temp account must be configured with Signers before using it
3. If the temp account already exists, the creation will be fail
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).
2. `string` - customized user id, which's length should be 10 bytes in hexadecimal at most

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const userId = '0123456789'
const txInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const result = LemoTx.signCreateTempAddress(testPrivate, txInfo, userId)
console.log(result)
// {"type":"9","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560243152","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo85SY56SGRTQQ63A2Y48GBNCRGJC25A6HTDGR","data":"0x7b227369676e657273223a5b7b2261646472657373223a224c656d6f38333642514b43425a385a3742374e3447344e34534e47425432345a5a534a5144323444222c22776569676874223a3130307d5d7d","sigs":["0x4a807e3c5f6af4a1bd1e4ba05c7e1261bf62b8768302ab140b3c43931096f17b7fae90376f6eaed3f97c38ae2f5e83fa61c03f2683df89129469c3d8cd0df82700"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signModifySigners"></a>
#### LemoTx.signModifySigners
```
tx.signModifySigners(privateKey, txConfig, signers)
```
Sign the transaction of the signers in the multi-signer account, then return the signed transaction string
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor).
2. `array` - Modified multiple signers list containing the fields `address` and `weight`

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

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
const result = LemoTx.signModifySigners('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, signers)
console.log(result)
// {"type":"9","version":"1","chainID":"200","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1561549968","data":"0x7b227369676e657273223a5b7b2261646472657373223a224c656d6f38333642514b43425a385a3742374e3447344e34534e47425432345a5a534a5144323444222c22776569676874223a35307d2c7b2261646472657373223a224c656d6f3833474e3732475948324e5a3842413732395a39544354374b5135464333435236444a47222c22776569676874223a35307d5d7d","sigs":["0x13ae8791ed6541bbd9583cf473195e80a54561ce29b0f0812e831a6d62704d965b7e257f3b2963b27854b3d0b5ac4b2e9473e4dcf8c6a7845ce8179a681b06f501"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signBoxTx"></a>
#### LemoTx.signBoxTx
```
tx.signBoxTx(privateKey, txConfig, subTxList) 
```
Sign a transaction for box transactions, then return the signed transaction string. 
1. Box transaction can store multiple signed transaction informations including special transactions, but cannot store box transactions
2. The timestamp of the box transaction is equal to the minimum timestamp of the child transaction in the box
3. The neutron in the box transactions will succeed or fail at the same time, if one of the sub-transaction does not succeed then all the transactions in the box trade will fail
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). For this API, `to` fields will be ignored.
3. `array` - Signed transaction list. The item should by signed transaction string or object

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const createTempAddressInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const createTempAddress = LemoTx.signCreateTempAddress('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', createTempAddressInfo, '0123456789')

const transferAssetInfo = {to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const transferAsset = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    transferAmount: '110000',
}
const signTransferAsset = LemoTx.signTransferAsset('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', transferAssetInfo, transferAsset)

const subTxList = [createTempAddress, signTransferAsset]
const result = LemoTx.signBoxTx('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', {chainID: '1', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}, subTxList)
console.log(result)
// {"type":"10","version":"1","chainID":"1","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1560486874","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","data":"0x7b2273756254784c697374223a5b7b2274797065223a2230222c2276657273696f6e223a2231222c22636861696e4944223a22323030222c226761735072696365223a2233303030303030303030222c226761734c696d6974223a2232303030303030222c22616d6f756e74223a2230222c2265787069726174696f6e54696d65223a2231353630343836383734222c2266726f6d223a224c656d6f38333642514b43425a385a3742374e3447344e34534e47425432345a5a534a5144323444222c22746f223a224c656d6f3835535935365347525451513633413259355a5742424247595433434143425936414238222c2264617461223a223078376232323733363936373665363537323733323233613562376232323631363436343732363537333733323233613232346336353664366633383333333634323531346234333432356133383561333734323337346533343437333434653334353334653437343235343332333435613561353334613531343433323334343432323263323237373635363936373638373432323361333133303330376435643764222c2273696773223a5b22307861326637376662613832383331333464333337633138316463363635306532633461396135343863633834656561313462356431363635656436623933636337316130373635616430643030656536333838393330366632376330343562646432623365643139313038393363326137623964666431653239623034363261323031225d2c22676173506179657253696773223a5b5d7d2c7b2274797065223a2237222c2276657273696f6e223a2231222c22636861696e4944223a22323030222c226761735072696365223a2233303030303030303030222c226761734c696d6974223a2232303030303030222c22616d6f756e74223a2230222c2265787069726174696f6e54696d65223a2231353630343836383734222c2266726f6d223a224c656d6f38333642514b43425a385a3742374e3447344e34534e47425432345a5a534a5144323444222c22746f223a224c656d6f383342594b5a4a34524e34544b4339433738524657375948573653383754505253483334222c2264617461223a2230783762323236313733373336353734343936343232336132323330373836343330363236353636363433333338333533303633333533373334363233373636333636313634333636363337333933343333363636353331333936323332333133323631363636363632333933303331333633323339333733383631363436333332333133393333363133303333333536333635363433383338333833343232326332323734373236313665373336363635373234313664366637353665373432323361323233313331333033303330333032323764222c2273696773223a5b22307861653666633965393561613938626161303162613439353061663636633031373062623765623862326339323262343238306264643863616338636466363132313236313732393964626339323065306538306561336534343566353134303166633339663761393433346336363533366264376564333734333037636432653030225d2c22676173506179657253696773223a5b5d7d5d7d","sigs":["0xa715e1cd58df234fb08be8803eebbe1c53b51e45a3fdee2fb7362d4664dc3ea84703d8e397868d416b1498d16fcf188af0806b6a11912f309288712f3854838101"],"gasPayerSigs":[]}
```

---

<a name="LemoTx-signContractCreation"></a>
#### LemoTx.signContractCreation
```
tx.signContractCreation(privateKey, txConfig, code, constructorArgs)
```
Sign a transaction for contract creation, then return the signed transaction string. 
The API fills some special information in data, and creates a LemoTx [`instance`](#tx-constructor), then sign it.

##### Parameters
1. `string` - Account private key
2. `object` - Unsigned transaction like the same parameter in [`tx constructor`](#Constructor). 
3. `string` - The hexadecimal string of the contract code
4. `string` - The hexadecimal string of a parameter constructed in the contract

##### Returns
`string` - The string of signed [transaction](#data-structure-transaction) information

##### Example
```js
const txInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const code = '0x000000100000100'
const constructorArgs = '213313'
const result = LemoTx.signContractCreation('0x432a86ab8765d82415a803e29864dcfc1ed93dac949abf6f95a583179f27e4bb', txInfo, code, constructorArgs)
console.log(result)
// {"type":"1","version":"1","chainID":"100","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"3000000000","gasLimit":"2000000","amount":"100","expirationTime":"1563365829","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","data":"0x0000001000001003313","sigs":["0x37c83328309196b39528be15cffbe1494a36c2df785ac0b0a1e14ac0649c9756552dbd930d5a3f21e40db530db0f066ce64365c8200f758e9258261c5e98b43b01"],"gasPayerSigs":[]}
```

---

### other API

<a name="tool-SDK_VERSION"></a>

#### LemoTx.SDK_VERSION

```
LemoTx.SDK_VERSION
```

`string` - The version of SDK

##### Example

```js
console.log(LemoTx.SDK_VERSION) // "1.0.0"
```

---

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

<a name="global-stopWatch"></a>
#### lemo.stopWatch
```
lemo.stopWatch()
```
Stop listening

##### Parameters
None

##### Returns
None

##### Example
```js
lemo.stopWatch()
```

---

<a name="global-isWatching"></a>
#### lemo.isWatching
```
lemo.isWatching()
```
True if is listening

##### Parameters
None

##### Returns
`boolean` - True if is listening

##### Example
```js
console.log(lemo.isWatching() ? 'watching' : 'not watching')
```

---

<a name="tool-verifyAddress"></a>
#### LemoTx.verifyAddress
```
LemoTx.verifyAddress(addr)
```
Verify LemoChain address

##### Parameters
1. `string` - LemoChain address

##### Returns
`string` - Verify error message. If the address is valid, then return empty string

##### Example
```js
const errMsg = LemoTx.verifyAddress('LEMObw')
if (errMsg) {
    console.error(errMsg);
}
```

---

<a name="tool-moToLemo"></a>
#### LemoTx.moToLemo
```
lemo.tool.moToLemo(mo)
```
Convert the unit from mo to LEMO

##### Parameters
1. `string|number` - mo

##### Returns
`bigNumber` - It returns an object of type bigNumber. If input an illegal string or number, it will throw an exception.

##### Example
```js
const result = LemoTx.moToLemo('0.1')
console.log(result.toString(10));// '0.0000000000000000001'
```

---

<a name="tool-lemoToMo"></a>
#### LemoTx.lemoToMo
```
LemoTx.lemoToMo(ether)
```
Convert the unit from LEMO to mo

##### Parameters
1. `string|number` - LEMO

##### Returns
`bigNumber` - It returns an object of type bigNumber. If input an illegal string or number, it will throw an exception.

##### Example
```js
const result = LemoTx.lemoToMo('0.1')
console.log(result.toString(10)) // '100000000000000000'
```

---

<a name="tool-toBuffer"></a>
#### LemoTx.toBuffer
```
LemoTx.toBuffer(data)
```
Convert the unit from LEMO to mo

##### Parameters
1. `number|string|BigNumber|Buffer|null` - The source data

##### Returns
`Buffer` - It returns an object of type Buffer. If the type of input is not supported, it will throw an exception.

##### Example
```js
const result = LemoTx.toBuffer('{"value": 100}')
console.log(result.toString('hex')) // '100000000000000000'
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
