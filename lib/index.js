import LemoTx from './tx/tx'
import {TxType, DeepLinkType} from './const'
import * as txFactory from './tx/tx_factory'
import {parseDeepLink, createPayDeepLink, createSignDeepLink} from './tx/deep_link'

/**
 * The type enum of transaction
 * @return {object}
 */
LemoTx.TxType = TxType
LemoTx.DeepLinkType = DeepLinkType
LemoTx.parseDeepLink = parseDeepLink
LemoTx.createPayDeepLink = createPayDeepLink
LemoTx.createSignDeepLink = createSignDeepLink

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
