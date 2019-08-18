import LemoTx from './tx/tx'
import {TxType} from './const'
import signMethods from './tx/sign_methods'

/**
 * The type enum of transaction
 * @return {object}
 */
LemoTx.TxType = TxType

Object.assign(LemoTx, signMethods)

export default LemoTx
