import LemoTx from './tx/tx'
import {TxType} from './const'
import signMethods from './tx/sign_methods'
import {parseDeepLink, createDeepLink} from './tx/deep_link'
/**
 * The type enum of transaction
 * @return {object}
 */
LemoTx.TxType = TxType
LemoTx.parseDeepLink = parseDeepLink
LemoTx.createDeepLink = createDeepLink
Object.assign(LemoTx, signMethods)
export default LemoTx
