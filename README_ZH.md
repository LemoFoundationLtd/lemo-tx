# LemoTx

[![npm](https://img.shields.io/npm/v/lemo-tx.svg?style=flat-square)](https://www.npmjs.com/package/lemo-tx)
[![Build Status](https://travis-ci.org/LemoFoundationLtd/lemo-tx.svg?branch=master)](https://travis-ci.org/LemoFoundationLtd/lemo-tx)
[![Coverage Status](https://coveralls.io/repos/github/LemoFoundationLtd/lemo-tx/badge.svg?branch=master)](https://coveralls.io/github/LemoFoundationLtd/lemo-tx?branch=master)
[![GitHub license](https://img.shields.io/badge/license-LGPL3.0-blue.svg?style=flat-square)](https://github.com/LemoFoundationLtd/lemo-tx/blob/master/LICENSE)

用于创建、操作和签名LemoChain的工具。

## 安装

### 使用yarn

```bash
yarn add lemo-tx
```

### 在浏览器中引入

* 在 html 中引入 `lemo-tx.min.js` 文件
* 通过全局变量使用 `LemoTx` 对象

## 示例

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

API | 功能
---|---
[new LemoTx(txInfo)](#tx-sign) | 创建普通交易
[tx.signWith(privateKey)](#tx-signWith) | 对交易进行签名
[tx.hash()](#tx-hash) | 计算交易hash值
[tx.toString()](#tx-toString) | 格式化交易json字符串

静态属性 | 说明
---|---
[LemoTx.sign(privakey, txConfig)](#tx-sign) | 对交易进行签名
[LemoTx.createVote(txInfo)](#tx-createVote) | 创建投票的交易
[LemoTx.createCandidate(txConfig, candidateInfo)](#tx-createCandidate) | 创建注册、注销候选人的交易
[LemoTx.createAsset(txConfig, createAssetInfo)](#tx-createAsset) | 创建资产的交易
[LemoTx.createIssueAsset(txConfig, issueAssetInfo)](#tx-createIssueAsset) | 创建发行交易
[LemoTx.createReplenishAsset(txConfig, replenishInfo)](#tx-createReplenishAsset) | 创建增发交易
[LemoTx.createModifyAsset(txConfig, modifyInfo)](#tx-createModifyAsset) | 创建修改资产的交易
[LemoTx.createTransferAsset(txConfig, transferAssetInfo)](#tx-createTransferAsset) | 创建资产交易的交易
[LemoTx.createNoGas(txConfig, gasPayer)](#tx-createNoGas) | 创建免费gas的交易
[LemoTx.createReimbursement(noGasTxStr, gasPrice, gasLimit)](#tx-createReimbursement) | 创建代付gas的交易
[LemoTx.createTempAddress(txConfig, userId)](#tx-createTempAddress) | 创建临时账户的交易
[LemoTx.createModifySigners(txConfig, signer)](#tx-createModifySigners) | 创建多重签名的交易
[LemoTx.createBoxTx(txConfig, subTxList)](#tx-createBoxTx) | 创建箱子交易
[LemoTx.createContractCreation(txConfig, code, constructorArgs)](#tx-createContractCreation) | 创建智能合约交易
[LemoTx.TxType](#class-TxType) | 交易类型

---

### 数据结构

<a name="data-structure-transaction"></a>
#### 交易
签名之后的交易
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
- `type` 交易类型
- `chainID` LemoChain的ID。正式网为 `1`，测试网为 `100`
- `version` 当前交易版本，介于0-128之间
- `from` 交易发送者的账户地址
- `to` 交易接受者的账户地址
- `gasPayer` 代付Gas的账户地址
- `toName` (可选) 交易接收者的账户名，会与账户地址进行比对校验。类似银行转账时填写的姓名与卡号的关系。最大长度为100字符
- `amount` 交易金额，`BigNumber`对象，单位`mo`。1`LEMO`=1000000000000000000`mo`=1e18`mo`
- `data` (可选) 交易附带的数据，可用于调用智能合约。根据交易类型也会有不同的作用
- `expirationTime` 交易过期时间戳，单位为秒。如果交易过期时间在半小时以后，则可能不会被打包，这取决于节点交易池的配置
- `gasLimit` 交易消耗的 gas 上限。如果超过这个限制还没运行结束，则交易失败，并且 gas 费用不退还
- `gasPrice` 交易消耗 gas 的单价，`BigNumber`对象，单位为`mo`。单价越高越优先被打包
- `hash` 交易 hash
- `message` (可选) 交易附带的文本消息。最大长度为1024字符
- `sigs` 交易签名数组，每个字段长度为65个字节
- `gasPayerSigs` 代付 gas 交易签名数组，每个字段长度为65个字节

<a name="data-transaction-type"></a>

交易类型 | 值 | 说明
---|---|---
LemoTx.TxType.ORDINARY | 0 | 普通转账交易或合约执行交易
LemoTx.TxType.CREATE_CONTRACT | 1 | 创建智能合约交易
LemoTx.TxType.VOTE | 2 | 设置投票对象
LemoTx.TxType.CANDIDATE | 3 | 注册或修改候选人信息
LemoTx.TxType.CREATE_ASSET | 4 | 创建资产信息
LemoTx.TxType.ISSUE_ASSET | 5 | 发行资产
LemoTx.TxType.REPLENISH_ASSET | 6 | 增发资产交易
LemoTx.TxType.MODIFY_ASSET | 7 | 修改资产交易
LemoTx.TxType.TRANSFER_ASSET | 8 | 交易资产
LemoTx.TxType.MODIFY_SIGNER | 9 | 修改多重签名
LemoTx.TxType.BOX_TX | 10 | 箱子交易，打包多笔交易，事务性地运行它们 

chainID | 说明
---|---
1 | LemoChain 主网
100 | LemoChain 测试网

<a name="data-structure-asset"></a>
#### 资产
资产信息
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
-   `category` 资产类型
-   `decimal` 发行资产的小数位，表示将总数细化到小数点后多少位，默认为18位
-   `totalSupply` 发行的资产总量，当资产在增发和销毁时发行的资产总量会实时变化，发行资产总量为`发行量*10^decimal`
-   `isReplenishable` 该资产是否可增发，在创建资产时设置，设置后不可再次修改，默认为`true`
-   `isDivisible` 该资产是否可分割，在创建资产时设置，设置后不可再次修改，默认为`true`
-   `issuer` 发行者地址，根据创建资产时的签名字段得到
-   `profile` 资产的其他信息，此部分内容可以再次修改
    -   `name` 创建该资产时的资产名称
    -   `symbol` 资产标识
    -   `description` 资产基本信息
    -   `suggestedGasLimit` 交易消耗的gas上限，和`gasLimit`相同用法，创建资产时由用户自己设置，默认为60000
    -   `freeze` 是否冻结资产，默认为`false`，将其设置为`true`可以停止该资产除查询以外的一切操作

<a name="data-asset-category"></a>
#### 资产类型
| category| 说明          |
| ------- | -------------- |
| 1       | 通证资产，和以太坊的ERC20代币类似，发行时可以设置是否允许今后增发，用户收到币后可以任意分割转账 |
| 2       | 非同质化资产，和以太坊的ERC721代币类似，可以携带少量资产信息，并且不可分割 |
| 3       | 通用资产，更加灵活的数字资产，适用于更加复杂的场景，以上两种资产都由通用资产特化而来 |


---

### tx API

<a name="Constructor"></a>
#### 构造交易
```
tx = new LemoTx({
    chainID: 1, 
    from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
    to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34',
    amount: 100,
})
```
- `type` - (number) (可选) 交易类型，默认为`0`
- `chainID` - (number) LemoChain的ID。正式网为 `1`，测试网为 `100`
- `version` - (number) (可选) 当前交易版本，默认为 `0`
- `to` - (string) (可选) 交易接收者账号.  `to` 为空表示在`data`字段中创建的智能合约
- `toName` - (string) (可选)交易接收者的账户名. 将会校验 `to` 的安全性
- `amount` - (number|string) (可选) 单位是`mo`. 默认为 `0`
- `gasPrice` - (number|string) (可选)交易消耗 gas 的单价，单位为 `mo`. 默认为 `2000000`
- `gasLimit` - (number|string) (可选) 交易消耗的 gas 上限. 默认为 `3000000000`
- `data` - (Buffer|string) (可选) 交易附带的数据，常用于调用智能合约
- `expirationTime` - (number|string) (可选) 交易过期时间戳，单位为秒. 默认为当前交易的时间
- `message` - (string) (可选)  交易附带的文本消息

---

<a name="tx-signWith"></a>
#### tx.signWith
```
tx.signWith(privateKey, txInfo)
```
签名交易并返回签名之后的交易信息字符串
此方法常用来实现离线交易：
1. 在离线设备上签名交易
2. 将交易后的信息字符串复制到线上。
3. 调用[lemo-client](https://github.com/LemoFoundationLtd/lemo-client) 中的[send](https://github.com/LemoFoundationLtd/lemo-client#submodule-tx-send)方法将交易发送到LemoChian

##### Parameters
1. `string` - 账户私钥
2. `object` - 需要签名的信息，和[tx构造交易](#Constructor)中的参数相同

##### Returns
`string` - 签名之后的交易信息字符串，可参照[交易](#data-structure-transaction)信息

##### Example
```js
const tx = new LemoTx({chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100})
tx.signWith('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52')
console.log(tx)
// {"type":0,"version":1,"chainID":100,"to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","toName":"","gasPrice":"3000000000","gasLimit":2000000,"amount":"100","expirationTime":1566808448,"data":"","message":"","sigs":["0x4e9c10699fa02d56ce79d333061b4c467de1700b8ca669a5c709d7354c19a5f464be4d15cb96c4060c0f269c93c933fb14f0c6217e1210996385a5951c45506100"],"gasPayerSigs":[],"from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPayer":""}
```

---

### static API

<a name="tx-sign"></a>
#### LemoTx.sign
```
LemoTx.sign(privakey, txConfig)
```
1.签名交易并返回签名后的交易信息字符串，该方法用于实现安全的离线交易（在离线电脑上签名，将签名后的数据拷贝到联网电脑上）   
2.调用[lemo-client](https://github.com/LemoFoundationLtd/lemo-client) 中的[send](https://github.com/LemoFoundationLtd/lemo-client#submodule-tx-send)方法将交易发送到LemoChian

##### Parameters
0. `string` - 账户私钥
1. `string` - 签名前的交易信息

##### Returns
`string` - 签名后的交易信息字符串

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const code = '0x000000100000100'
const constructorArgs = '213313'
const unsignedTx = LemoTx.createContractCreation(txInfo, code, constructorArgs)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', unsignedTx)
console.log(signedTxStr) // {"type":"1","version":"1","chainID":"1","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"3000000000","gasLimit":"2000000","amount":"100","expirationTime":"1567152222","to":"Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34","data":"0x0000001000001003313","sigs":["0xd897e25a640dda2d56ecb986c7b4c0dc835fd5131a434a5f5ca0ee1cd9caf8dc292dc4cefc9242c41a6e7976e000d66113232ff347e4db963dbaf70896fb27de00"],"gasPayerSigs":[]}
// 调用lemo-client方法，lemo.send(signTx)
```

<a name="tx-crateVote"></a>
#### LemoTx.crateVote
```
LemoTx.crateVote(txInfo)
```
创建一个未签名的[`LemoTx`](#tx-constructor)投票交易    

##### Parameters
1. `object` - 未签名的交易信息，细节可参考 [构造交易](#Constructor).
在投票特殊交易中的`to`表示投票对象的账户地址，`amount`、`data`字段会被忽略

##### Returns
`LemoTx` - 未签名的LemoTx实例

##### Example
```js
const txInfo = {from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34'}
const tx = LemoTx.crateVote(txInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="#tx-createCandidate"></a>
#### LemoTx.createCandidate
```
LemoTx.createCandidate(txInfo, candidateInfo)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于注册或编辑候选人信息的特殊交易，此方法在`data`中填充了特殊信息   

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [tx constructor](#Constructor)。这里的`to`、`toName`、`amount`、`data`字段会被忽略. 
1. `object` - 候选人信息

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const candidateInfo = {
    isCandidate: true,
    name: 'cross-chain-node',
    teamName: 'lemo-tac-team',
    minerAddress: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
    nodeID: '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
    host: '127.0.0.1',
    port: '7001',
    introduction: 'this is a demo',
    email: 'abc@gmail.com',
}
const tx = LemoTx.createCandidate(txInfo, candidateInfo)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createAsset"></a>
#### LemoTx.createAsset
```
LemoTx.createAsset(txConfig, createAssetInfo)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于创建资产的特殊交易，此方法在`data`中填充了特殊信息   

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)。其中`to`, `amount`, `toName`字段会被省略
1. `object` - 创建资产的信息，即[资产](#data-structure-asset)中的信息。

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息

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
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createIssueAsset"></a>
#### LemoTx.createIssueAsset
```
LemoTx.createIssueAsset(txConfig, issueAssetInfo)
```
1.创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于发行资产的交易，此方法在`data`中填充了特殊信息  

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [tx constructor](#Constructor)。
1. `object` - 发行资产的信息， 包含 `assetCode`, `metaData`, `supplyAmount` 字段

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，发行信息会放在`data`字段内

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
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createReplenishAsset"></a>
#### LemoTx.createReplenishAsset
```
LemoTx.createReplenishAsset(txConfig, replenishInfo)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于增发资产的交易，此方法在`data`中填充了特殊信息    

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)。
1. `object` - 增发资产的信息， 包含`assetCode`，`assetId`，`replenishAmount`字段

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，增发信息会放在`data`字段内  

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
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createModifyAsset"></a>
#### LemoTx.createModifyAsset
```
LemoTx.createModifyAsset(txConfig, modifyInfo)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于修改资产的交易，此方法在`data`中填充了特殊信息  

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)。
1. `object` - 修改资产的信息， 包含`assetCode`和`info`字段，`info`对象中包含需要修改的内容，如`name`、`symbol`、`description`、`freeze`、`suggestedGasLimit`等

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，修改信息会放在`data`字段内

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
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createTransferAsset"></a>
#### LemoTx.createTransferAsset
```
LemoTx.createTransferAsset(txConfig, transferAssetInfo)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于交易资产的交易，此方法在`data`中填充了特殊信息    

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)。
1. `object` - 修改资产的信息， 包含包含`assetID`字段

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，交易信息会放在`data`字段内

##### Example
```js
const txInfo = {chainID: 1, to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const transferAsset = {
    assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
    transferAmount: '110000',
}
const tx = LemoTx.createTransferAsset(txInfo, transferAsset)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createNoGas"></a>
#### LemoTx.createNoGas
```
LemoTx.createNoGas(txConfig, gasPayer)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于免Gas费用的交易，此方法在`data`中填充了特殊信息 

1. 对包含`gasPayer`账户地址的交易信息进行签名，该交易信息中不含`gasLimit`和`gasPrice`字段
2. 把返回的字符串交给代付gas的人
3. 代付gas的人填上`gasLimit`和`gasPrice`字段，然后用自己的私钥对其进行签名，返回最终的交易信息字符串
4. 通过lemo-client的send方法把交易信息字符串发送到 LemoChain

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor). 其中, 交易信息中的`gasLimit`, `gasPrice` 字段会被忽略
1. `string` - Gas代付账户的地址

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息

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
创建一个未签名的[`LemoTx`](#tx-constructor)实例，对免代付Gas费用的交易进行签名，创建为其代付的gas交易，此方法在`data`中填充了特殊信息  

##### Parameters
0. `string` - 通过[LemoTx.createNoGas](#tx-createNoGas) 方法得到的交易信息并进行签名后的数据
1. `string` - 交易消耗 gas 的单价，单位为 `mo`
2. `string` - 交易消耗的总 gas 上限

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息

##### Example
```js
const txInfo = {chainID: 1, to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY', from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'}
const gasPayer = 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
const noGasInfo = LemoTx.createNoGas(txInfo, gasPayer)
const tx = LemoTx.createReimbursement(noGasInfo, 2, 100)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createTempAddress"></a>
#### LemoTx.createTempAddress
```
LemoTx.createTempAddress(txConfig, userId)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于创建临时账户的交易，此方法在`data`中填充了特殊信息
1. 临时账户没有私钥，只能由Signers中的账户进行签名
2. 临时账户必须先配置Signers才能使用
3. 如果账户已存在，则创建失败  

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)
1. `string` - 用户自定义的id，必须是一个10字节以内的十六进制字符串

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，，临时账户信息会放在`data`字段内

##### Example
```js
const userId = '0123456789'
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83JW7TBPA7P2P6AR9ZC2WCQJYRNHZ4NJD4CY'}
const tx = LemoTx.createTempAddress(txInfo, userId)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createModifySigners"></a>
#### LemoTx.createModifySigners
```
LemoTx.createModifySigners(txConfig, signers)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于多重签名的交易，此方法在`data`中填充了特殊信息  

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)
1. `array` - 多重签名的列表，包含 `address` 和 `weight`字段

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，修改多重签名信息会放在`data`字段内

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
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createBoxTx"></a>
#### LemoTx.createBoxTx
```
tx.createBoxTx(txConfig, subTxList) 
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于创建箱子交易，此方法在`data`中填充了特殊信息
1. 箱子交易可以储存包括特殊交易在内的多个完整的交易信息，但是不能在箱子交易里面再储存箱子交易
2. 箱子交易的时间戳等于箱子中的子交易的最小时间戳
3. 箱子交易中子交易会同时成功或失败，如果有一个子交易没有成功那么箱子交易中所有交易都失败
4. 箱子交易的子交易必须是已经签好名的交易

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)，箱子交易中`to`会被省略
1. `array` - 子交易列表，列表中的交易必须是字符串或对象的形式并且已经签好名之后的交易

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，箱子交易的子交易在 `data` 字段内

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
// 调用lemo-client方法，lemo.send(signTx)
```

---

<a name="tx-createContractCreation"></a>
#### LemoTx.createContractCreation
```
tx.createContractCreation(txConfig, code, constructorArgs)
```
创建一个未签名的[`LemoTx`](#tx-constructor)实例，用于创建智能合约的交易，此方法在`data`中填充了特殊信息   

##### Parameters
0. `object` - 签名前的交易信息，细节参考 [构造交易](#Constructor)
1. `string` - 合约代码的十六进制字符串
2. `string` - 合约中构造的参数的十六进制字符串

##### Returns
`LemoTx` - 构造未签名的LemoTx实例的交易信息，智能合约信息会放在`data`字段内

##### Example
```js
const txInfo = {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D', to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34', amount: 100}
const code = '0x000000100000100'
const constructorArgs = '213313'
const tx = LemoTx.createContractCreation(txInfo, code, constructorArgs)
const signedTxStr = LemoTx.sign('0xfdbd9978910ce9e1ed276a75132aacb0a12e6c517d9bd0311a736c57a228ee52', tx)
// 调用lemo-client方法，lemo.send(signTx)
```

---

### other API

<a name="tool-TxType"></a>

#### LemoTx.TxType

```
LemoTx.TxType
```

交易类型，可参考[交易类型](#data-transaction-type)。 其中，数据类型是 `number` 

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
