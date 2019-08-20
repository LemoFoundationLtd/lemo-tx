import lemoUtils from 'lemo-utils'
import {toRaw, arrayToRaw} from './tx_helper'
import {TX_ADDRESS_LENGTH, TxType} from '../const'


export default class Signer {
    /**
     * Sign a transaction with private key
     * @param {Tx} tx
     * @param {string|Buffer} privateKey
     * @return {string} The signature
     */
    sign(tx, privateKey) {
        privateKey = lemoUtils.toBuffer(privateKey)
        const sig = lemoUtils.sign(privateKey, this.hashForSign(tx))
        return `0x${sig.toString('hex')}`
    }

    /**
     * Recover from sigs address from a signed transaction
     * @param {Tx} tx
     * @return {[string]}
     */
    recover(tx) {
        return tx.sigs.map(sig => {
            const pubKey = lemoUtils.recover(this.hashForSign(tx), lemoUtils.toBuffer(sig))
            if (!pubKey) {
                throw new Error('invalid signature')
            }
            return lemoUtils.pubKeyToAddress(pubKey)
        })
    }

    hashForSign(tx) {
        const raw = [
            toRaw(tx.type, 'type'),
            toRaw(tx.version, 'version'),
            toRaw(tx.chainID, 'chainID'),
            toRaw(lemoUtils.decodeAddress(tx.from), 'from', TX_ADDRESS_LENGTH),
            tx.gasPayer ? toRaw(lemoUtils.decodeAddress(tx.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            tx.to ? toRaw(lemoUtils.decodeAddress(tx.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(tx.toName, 'toName'),
            toRaw(tx.gasPrice, 'gasPrice'),
            toRaw(tx.gasLimit, 'gasLimit'),
            toRaw(tx.amount, 'amount'),
            tx.type === TxType.BOX_TX ? arrayToRaw(this.getSignHashData(tx), 'data') : toRaw(tx.data, 'data'),
            toRaw(tx.expirationTime, 'expirationTime'),
            toRaw(tx.message, 'message'),
        ]

        return lemoUtils.sha3(lemoUtils.rlpEncode(raw))
    }

    getSignHashData(tx) {
        const data = JSON.parse(lemoUtils.decodeUtf8Hex(tx.data))
        return data.subTxList.map(item => this.hashForSign(item).toString('hex'))
    }
}
