import BigNumber from 'bignumber.js'
import {toHexStr, toBuffer, decodeAddress, rlpEncode, sha3, decodeUtf8Hex, isBuffer} from 'lemo-utils'
import {TxType, TX_ADDRESS_LENGTH, TX_VERSION, TTTL, TX_DEFAULT_GAS_LIMIT, TX_DEFAULT_GAS_PRICE} from '../const'
import {verifyTxConfig, toRaw, arrayToRaw} from './tx_helper'
import Signer from './signer'
import GasSigner from './gas_signer'


export default class Tx {
    /**
     * Create transaction object
     * @param {object} txConfig
     * @param {number|string?} txConfig.type The type of transaction
     * @param {number|string?} txConfig.version The version of transaction protocol
     * @param {number|string} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.to The transaction recipient address
     * @param {string?} txConfig.from The transaction sender address
     * @param {string?} txConfig.toName The transaction recipient name
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {object|string?} txConfig.data Extra data or smart contract calling parameters
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature hex data list
     * @param {Array?} txConfig.gasPayerSigs Gas payer signature hex data list
     */
    constructor(txConfig) {
        if (Tx.isLemoTx(txConfig)) {
            txConfig = txConfig.toJson()
        }
        verifyTxConfig(txConfig)
        this.normalize(txConfig)
    }

    static isLemoTx(txConfig) {
        const result = [
            checkClassMethod(txConfig, 'normalize'),
            checkClassMethod(txConfig, 'signWith'),
            checkClassMethod(txConfig, 'serialize'),
            checkClassMethod(txConfig, 'hash'),
        ]
        return !result.includes(false)
    }

    normalize(txConfig) {
        // type number
        this.type = parseDecInt(txConfig.type, TxType.ORDINARY)
        // version number
        this.version = parseDecInt(txConfig.version, TX_VERSION)
        // chainID number. We always leave it be 0 before send it through client
        this.chainID = parseInt(txConfig.chainID, 10) || 0
        // to string
        this.to = txConfig.to || ''
        // toName string
        this.toName = (txConfig.toName || '').toString()
        // gasPrice BigNumber
        this.gasPrice = new BigNumber(txConfig.gasPrice !== undefined && txConfig.gasPrice !== '' ? txConfig.gasPrice : TX_DEFAULT_GAS_PRICE)
        // gasLimit number
        this.gasLimit = parseDecInt(txConfig.gasLimit, TX_DEFAULT_GAS_LIMIT)
        // amount BigNumber
        this.amount = new BigNumber(txConfig.amount !== undefined && txConfig.amount !== '' ? txConfig.amount : 0)
        // expirationTime number. seconds
        this.expirationTime = parseDecInt(txConfig.expirationTime, 0) || (Math.floor(Date.now() / 1000) + TTTL)

        // data string
        if (txConfig.data && typeof txConfig.data === 'object' && !isBuffer(txConfig.data)) {
            this.data = toHexStr(toBuffer(JSON.stringify(txConfig.data)))
        } else {
            this.data = toHexStr(txConfig.data)
        }
        // message string
        this.message = (txConfig.message || '').toString()
        // sigs Array
        if (txConfig.sigs && Array.isArray(txConfig.sigs)) {
            this.sigs = txConfig.sigs.map(toHexStr)
        } else {
            this.sigs = []
        }
        // gasPayerSig Array
        if (txConfig.gasPayerSigs && Array.isArray(txConfig.gasPayerSigs)) {
            this.gasPayerSigs = txConfig.gasPayerSigs.map(toHexStr)
        } else {
            this.gasPayerSigs = []
        }
        // from string
        this.from = txConfig.from
        // gasPayer
        this.gasPayer = txConfig.gasPayer || ''
    }

    /**
     * Sign a transaction with private key
     * @param {string|Buffer} privateKey
     */
    signWith(privateKey) {
        const sig = new Signer().sign(this, privateKey)
        if (!this.sigs.includes(sig)) {
            this.sigs.push(sig)
        }
    }

    /**
     * rlp encode for hash
     * @return {Buffer}
     */
    serialize() {
        const raw = [
            toRaw(this.type, 'type'),
            toRaw(this.version, 'version'),
            toRaw(this.chainID, 'chainID'),
            toRaw(decodeAddress(this.from), 'from', TX_ADDRESS_LENGTH),
            this.gasPayer ? toRaw(decodeAddress(this.gasPayer), 'gasPayer', TX_ADDRESS_LENGTH) : '',
            this.to ? toRaw(decodeAddress(this.to), 'to', TX_ADDRESS_LENGTH) : '',
            toRaw(this.toName, 'toName'),
            toRaw(this.gasPrice, 'gasPrice'),
            toRaw(this.gasLimit, 'gasLimit'),
            toRaw(this.amount, 'amount'),
            this.type === TxType.BOX_TX ? arrayToRaw(getHashData(this), 'data') : toRaw(this.data, 'data'),
            toRaw(this.expirationTime, 'expirationTime'),
            toRaw(this.message, 'message'),
            arrayToRaw(this.sigs, 'sigs'),
            arrayToRaw(this.gasPayerSigs, 'gasPayerSigs'),
        ]

        return rlpEncode(raw)
    }

    /**
     * compute hash of all fields including of sig
     * @return {string}
     */
    hash() {
        const hashBuffer = sha3(this.serialize())
        return `0x${hashBuffer.toString('hex')}`
    }

    hashForSign() {
        return new Signer().hashForSign(this)
    }

    hashForGasSign() {
        return new GasSigner().hashForGasSign(this)
    }

    hashForNoGasSign() {
        return new GasSigner().hashForNoGasSign(this)
    }

    /**
     * format for rpc
     * @return {object}
     */
    toJson() {
        const result = {
            type: this.type.toString(10),
            version: this.version.toString(10),
            chainID: this.chainID.toString(10),
            from: this.from,
            gasPrice: this.gasPrice.toString(10),
            gasLimit: this.gasLimit.toString(10),
            amount: this.amount.toString(10),
            expirationTime: this.expirationTime.toString(10),
        }
        setIfExist(result, 'gasPayer', this.gasPayer)
        setIfExist(result, 'to', this.to)
        setIfExist(result, 'toName', this.toName)
        setIfExist(result, 'data', this.data)
        setIfExist(result, 'message', this.message)
        setIfExist(result, 'sigs', this.sigs)
        setIfExist(result, 'gasPayerSigs', this.gasPayerSigs)
        return result
    }

    /**
     * format for rpc
     * @return {string}
     */
    toString() {
        return JSON.stringify(this.toJson())
    }
}

function setIfExist(obj, fieldName, value) {
    if (value) {
        obj[fieldName] = value
    }
}

function getHashData(tx) {
    const data = JSON.parse(decodeUtf8Hex(tx.data))
    return data.subTxList.map(item => item.hash())
}

function checkClassMethod(obj, funName) {
    return !Object.prototype.hasOwnProperty.call(obj, `${funName}`) && typeof obj[funName] === 'function'
}

function parseDecInt(number, defaultVal) {
    return parseInt(number !== undefined && number !== '' ? number : defaultVal, 10)
}
