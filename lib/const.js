// The id of chain network.should between 0 to 128
export const CHAIN_ID_MAIN_NET = 1
export const CHAIN_ID_DEV_NET = 100
// Current transaction version. should between 0 to 128
export const TX_VERSION = 1
// Transaction Time To Live. It is set on chain
export const TTTL = 30 * 60
// Gas price for smart contract. Unit is mo/gas
export const TX_DEFAULT_GAS_PRICE = 3000000000
// Max gas limit for smart contract. Unit is gas
export const TX_DEFAULT_GAS_LIMIT = 2000000

export const TxType = {
    // Ordinary transaction for transfer LEMO or call smart contract
    ORDINARY: 0,
    // 创建智能合约交易
    CREATE_CONTRACT: 1,
    // Vote transaction for set vote target
    VOTE: 2,
    // Candidate transaction for register or edit candidate information
    CANDIDATE: 3,
    // 创建资产交易
    CREATE_ASSET: 4,
    // 发行资产交易
    ISSUE_ASSET: 5,
    // 增发资产交易
    REPLENISH_ASSET: 6,
    // 修改资产交易
    MODIFY_ASSET: 7,
    // 交易资产交易
    TRANSFER_ASSET: 8,
    // 修改多重签名
    MODIFY_SIGNER: 9,
    // 箱子交易
    BOX_TX: 10,
}

export const CreateAssetType = {
    // 通证资产
    TokenAsset: 1,
    // 非同质化资产
    NonFungibleAsset: 2,
    // 通用资产
    CommonAsset: 3,
}

// The length of nodeID
export const NODE_ID_LENGTH = 128
// The max length limit of toName field in transaction
export const MAX_TX_TO_NAME_LENGTH = 100
// The max length limit of message field in transaction
export const MAX_TX_MESSAGE_LENGTH = 1024
// The max length limit of host field in deputy
export const MAX_DEPUTY_HOST_LENGTH = 128
// The length of address field in transaction
export const TX_ADDRESS_LENGTH = 20
// The length of signature bytes in transaction
export const TX_SIG_BYTE_LENGTH = 65
// 发行资产的唯一标识长度
export const TX_ASSET_CODE_LENGTH = 66
// 交易的资产Id长度
export const TX_ASSET_ID_LENGTH = 66
// 创建资产时小数位数不能大于18
export const MAX_DECIMAL_DIGITS = 18
