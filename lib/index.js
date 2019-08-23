import LemoTx from './tx/tx'
import {TxType} from './const'
import txFactory from './tx/tx_factory'

/**
 * The type enum of transaction
 * @return {object}
 */
LemoTx.TxType = TxType

Object.assign(LemoTx, txFactory)

/**
 * Sign transaction and return the config which used to send
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @return {string}
 */
LemoTx.sign = (privateKey, txConfig) => {
    const tx = new LemoTx(txConfig)
    tx.signWith(privateKey)
    return tx.toString()
}

export default LemoTx
