import {toBuffer, sign, sha3, rlpEncode, decodeAddress, decodeUtf8Hex} from 'lemo-utils'
import {arrayToRaw, toRaw} from './tx_helper'
import {TX_ADDRESS_LENGTH, TxType} from '../const'


export default class GasSigner {
    /**
     * Recover from address from a signed gas transaction
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {string}
     */
    signGas(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForGasSign(tx))
        return `0x${sig.toString('hex')}`
    }

    /**
     * Recover from address from a signed no gas transaction
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {string}
     */
    signNoGas(tx, privateKey) {
        privateKey = toBuffer(privateKey)
        const sig = sign(privateKey, this.hashForNoGasSign(tx))
        return `0x${sig.toString('hex')}`
    }

    hashForGasSign(tx) {
        const raw = [
            arrayToRaw(tx.sigs, 'sigs'),
            toRaw(tx.gasPrice, 'gasPrice'),
            toRaw(tx.gasLimit, 'gasLimit'),
        ]

        return sha3(rlpEncode(raw))
    }

    hashForNoGasSign(tx) {
        const raw = [
            toRaw(tx.type, 'type'),
            toRaw(tx.version, 'version'),
            toRaw(tx.chainID, 'chainID'),
            toRaw(decodeAddress(tx.from), 'from', TX_ADDRESS_LENGTH),
            tx.gasPayer ? toRaw(decodeAddress(tx.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            tx.to ? toRaw(decodeAddress(tx.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(tx.toName, 'toName'),
            toRaw(tx.amount, 'amount'),
            tx.type === TxType.BOX_TX ? arrayToRaw(this.getGasHashData(tx), 'data') : toRaw(tx.data, 'data'),
            toRaw(tx.expirationTime, 'expirationTime'),
            toRaw(tx.message, 'message'),
        ]
        return sha3(rlpEncode(raw))
    }

    getGasHashData(tx) {
        const data = JSON.parse(decodeUtf8Hex(tx.data))
        return data.subTxList.map(item => this.hashForNoGasSign(item))
    }
}
