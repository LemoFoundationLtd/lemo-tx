import {TxType} from '../../const'
import Tx from '../tx'
import {verifyTransferAssetInfo} from '../tx_helper'

export default class TransferAssetTx extends Tx {
    /**
     * 交易资产的交易
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction sender address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {object} transferAssetInfo TransferAsset information
     * @param {string} transferAssetInfo.assetId Asset id of the transaction
     * @param {string} transferAssetInfo.transferAmount Number of transactions
     */
    constructor(txConfig, transferAssetInfo) {
        verifyTransferAssetInfo(transferAssetInfo)
        const newTransferAsset = {
            assetId: transferAssetInfo.assetId,
            transferAmount: transferAssetInfo.transferAmount,
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.TRANSFER_ASSET,
            data: newTransferAsset,
        }
        delete newTxConfig.amount
        super(newTxConfig)
    }
}
