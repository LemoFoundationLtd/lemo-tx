import Tx from '../tx'
import {verifyModifySignersInfo} from '../tx_helper'
import {TxType} from '../../const'

export default class modifySignersTx extends Tx {
    /**
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
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {Array} signers modify signers
     */
    constructor(txConfig, signers) {
        verifyModifySignersInfo({signers})
        const newModifySigners = {
            signers,
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.MODIFY_SIGNER,
            data: newModifySigners,
        }
        super(newTxConfig)
    }
}
