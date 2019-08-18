import lemoUtils from 'lemo-utils'
import {arrayToRaw, toRaw} from './tx_helper'
import {TX_ADDRESS_LENGTH} from '../const'


export default class GasSigner {
    /**
     * Recover from address from a signed gas transaction
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {string}
     */
    signGas(tx, privateKey) {
        privateKey = lemoUtils.toBuffer(privateKey)
        const sig = lemoUtils.sign(privateKey, this.hashForGasSign(tx))
        return `0x${sig.toString('hex')}`
    }

    /**
     * Recover from address from a signed no gas transaction
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {string}
     */
    signNoGas(tx, privateKey) {
        privateKey = lemoUtils.toBuffer(privateKey)
        const sig = lemoUtils.sign(privateKey, this.hashForNoGasSign(tx))
        return `0x${sig.toString('hex')}`
    }

    hashForGasSign(tx) {
        const raw = [
            arrayToRaw(tx.sigs, 'sigs'),
            toRaw(tx.gasPrice, 'gasPrice'),
            toRaw(tx.gasLimit, 'gasLimit'),
        ]

        return lemoUtils.sha3(lemoUtils.rlpEncode(raw))
    }

    hashForNoGasSign(tx) {
        const raw = [
            toRaw(tx.type, 'type'),
            toRaw(tx.version, 'version'),
            toRaw(tx.chainID, 'chainID'),
            toRaw(lemoUtils.decodeAddress(tx.from), 'from', TX_ADDRESS_LENGTH),
            tx.gasPayer ? toRaw(lemoUtils.decodeAddress(tx.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            tx.to ? toRaw(lemoUtils.decodeAddress(tx.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(tx.toName, 'toName'),
            toRaw(tx.amount, 'amount'),
            toRaw(tx.data, 'data'),
            toRaw(tx.expirationTime, 'expirationTime'),
            toRaw(tx.message, 'message'),
        ]
        return lemoUtils.sha3(lemoUtils.rlpEncode(raw))
    }
}
