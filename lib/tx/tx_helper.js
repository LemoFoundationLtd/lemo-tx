import {toBuffer, setBufferLength, bufferTrimLeft, has0xPrefix, verifyAddress} from 'lemo-utils'
import errors from '../errors'
import {
    NODE_ID_LENGTH,
    MAX_TX_TO_NAME_LENGTH,
    MAX_TX_MESSAGE_LENGTH,
    MAX_DEPUTY_FIELD_LENGTH,
    MAX_DEPUTY_LONG_FIELD_LENGTH,
    TX_SIG_BYTE_LENGTH,
    TX_ASSET_CODE_LENGTH,
    TX_ASSET_ID_LENGTH,
    TxType,
    MAX_DECIMAL_DIGITS,
} from '../const'

/**
 * @return {Buffer}
 */
export function toRaw(data, fieldName, length) {
    data = toBuffer(data)
    if (length) {
        if (data.length > length) {
            throw new Error(errors.TXFieldToLong(fieldName, length))
        }
        data = setBufferLength(data, length, false)
    } else {
        data = bufferTrimLeft(data)
    }
    return data
}

/**
 * Array to buffer
 * @param {Array} data
 * @param {string} fieldName
 * @return {Array}
 */
export function arrayToRaw(data, fieldName) {
    return data.map(item => toRaw(item, fieldName))
}

export function verifyTxConfig(config) {
    if (config.chainID) {
        checkFieldType(config, 'chainID', ['number', 'string'], true)
        checkRange(config, 'chainID', 1, 0xffff)
    }
    if (!config.from) {
        throw new Error(errors.FieldIsRequired('from'))
    }
    checkFieldType(config, 'from', ['string'], false)
    checkAddress(config.from)
    if (config.type !== undefined && config.type !== '') {
        checkFieldType(config, 'type', ['number', 'string'], true)
        checkRange(config, 'type', 0, 0xffff)
    }
    if (config.version !== undefined && config.version !== '') {
        checkFieldType(config, 'version', ['number', 'string'], true)
        checkRange(config, 'version', 0, 0xff)
    }
    if (config.to) {
        checkFieldType(config, 'to', ['string'], false)
        // verify address
        checkAddress(config.to)
    }
    if (config.gasPayer) {
        checkFieldType(config, 'gasPayer', ['string'], false)
        // verify address
        checkAddress(config.gasPayer)
    }
    if (config.toName) {
        checkFieldType(config, 'toName', ['string'], false)
        checkMaxLength(config, 'toName', MAX_TX_TO_NAME_LENGTH)
        if (!/^[\w\-.]+$/.test(config.toName)) {
            throw new Error(errors.InvalidToName())
        }
    }
    if (config.gasPrice !== undefined && config.gasPrice !== '') {
        checkFieldType(config, 'gasPrice', ['number', 'string'], true)
        checkNegative(config, 'gasPrice')
    }
    if (config.gasLimit !== undefined && config.gasLimit !== '') {
        checkFieldType(config, 'gasLimit', ['number', 'string'], true)
        checkNegative(config, 'gasLimit')
    }
    if (config.amount !== undefined && config.amount !== '') {
        checkFieldType(config, 'amount', ['number', 'string'], true)
        checkNegative(config, 'amount')
    }
    if (config.data !== undefined && config.data !== '') {
        checkFieldType(config, 'data', ['string', 'object'], true)
    }
    if (config.expirationTime !== undefined && config.expirationTime !== '') {
        checkFieldType(config, 'expirationTime', ['number', 'string'], true)
        checkNegative(config, 'expirationTime')
    }
    if (config.message) {
        checkFieldType(config, 'message', ['string'], false)
        checkMaxLength(config, 'message', MAX_TX_MESSAGE_LENGTH)
    }
    if (config.sigs) {
        checkFieldType(config, 'sigs', ['array'], false)
        config.sigs.forEach((sig, index) => {
            checkType(sig, `sigs[${index}]`, ['string'], false)
            checkBytesLength(sig, `sigs[${index}]`, TX_SIG_BYTE_LENGTH)
        })
    }
    if (config.gasPayerSigs) {
        checkFieldType(config, 'gasPayerSigs', ['array'], false)
        config.gasPayerSigs.forEach((gasPayerSig, index) => {
            checkType(gasPayerSig, `gasPayerSigs[${index}]`, ['string'], false)
            checkBytesLength(gasPayerSig, `gasPayerSigs[${index}]`, TX_SIG_BYTE_LENGTH)
        })
    }
}

export function verifyCandidateInfo(config) {
    checkFieldType(config, 'isCandidate', ['undefined', 'boolean'], false)
    checkFieldType(config, 'nodeID', ['string'], false)
    if (config.nodeID.length !== NODE_ID_LENGTH) {
        throw new Error(errors.TXInvalidLength('nodeID', config.nodeID, NODE_ID_LENGTH))
    }
    if (config.host === '') {
        throw new Error(errors.FieldIsRequired('host'))
    }
    checkFieldType(config, 'host', ['string'], false)
    checkMaxLength(config, 'host', MAX_DEPUTY_FIELD_LENGTH)
    checkFieldType(config, 'port', ['string', 'number'], true)
    checkRange(config, 'port', 1, 0xffff)
    if (config.name) {
        checkFieldType(config, 'name', ['string'], false)
        checkMaxLength(config, 'name', MAX_DEPUTY_FIELD_LENGTH)
    }
    if (config.teamName) {
        checkFieldType(config, 'teamName', ['string'], false)
        checkMaxLength(config, 'teamName', MAX_DEPUTY_FIELD_LENGTH)
    }
    if (config.incomeAddress) {
        checkFieldType(config, 'incomeAddress', ['string'], false)
        // verify address
        checkAddress(config.incomeAddress)
    }
    if (config.introduction) {
        checkFieldType(config, 'introduction', ['string'], false)
        checkMaxLength(config, 'introduction', MAX_DEPUTY_LONG_FIELD_LENGTH)
    }
    if (config.email) {
        checkFieldType(config, 'email', ['string'], false)
        checkMaxLength(config, 'email', MAX_DEPUTY_FIELD_LENGTH)
        checkEmail(config.email)
    }
}

export function verifyCreateAssetInfo(config) {
    if (config.category === undefined) {
        throw new Error(errors.TXParamMissingError('category'))
    }
    checkFieldType(config, 'category', ['number'], true)
    checkRange(config, 'category', 1, 3)
    checkFieldType(config, 'decimal', ['number'], true)
    checkRange(config, 'decimal', 0, MAX_DECIMAL_DIGITS)
    checkFieldType(config, 'isReplenishable', ['boolean'], false)
    checkFieldType(config, 'isDivisible', ['boolean'], false)
    checkFieldType(config.profile, 'name', ['string'], false)
    checkFieldType(config.profile, 'symbol', ['string'], false)
    checkFieldType(config.profile, 'description', ['string'], false)
    checkMaxLength(config.profile, 'description', 256)
    if (config.profile.suggestedGasLimit) {
        checkFieldType(config.profile, 'suggestedGasLimit', ['string'], true)
    }
}

export function verifyIssueAssetInfo(config) {
    if (config.assetCode === undefined) {
        throw new Error(errors.TXParamMissingError('assetCode'))
    }
    checkFieldType(config, 'assetCode', ['string'], false)
    if (config.assetCode.length !== TX_ASSET_CODE_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetCode', config.assetCode, TX_ASSET_CODE_LENGTH))
    }
    if (config.metaData) {
        checkFieldType(config, 'metaData', ['string'], false)
        checkMaxLength(config, 'metaData', 256)
    }
    if (config.supplyAmount === undefined) {
        throw new Error(errors.TXParamMissingError('supplyAmount'))
    }
    checkNegative(config, 'supplyAmount')
    checkFieldType(config, 'supplyAmount', ['string'], true)
    if (/^0x/i.test(config.supplyAmount)) {
        throw new Error(errors.TXIsNotDecimalError('supplyAmount'))
    }
}

export function verifyReplenishAssetInfo(config) {
    checkFieldType(config, 'assetCode', ['string'], false)
    if (config.assetCode.length !== TX_ASSET_CODE_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetCode', config.assetCode, TX_ASSET_CODE_LENGTH))
    }
    checkFieldType(config, 'assetId', ['string'], false)
    if (config.assetId.length !== TX_ASSET_ID_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetId', config.assetId, TX_ASSET_ID_LENGTH))
    }
    checkFieldType(config, 'replenishAmount', ['number', 'string'], true)
    checkNegative(config, 'replenishAmount')
}

export function verifyModifyAssetInfo(config) {
    checkFieldType(config, 'assetCode', ['string'], false)
    if (config.assetCode.length !== TX_ASSET_CODE_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetCode', config.assetCode, TX_ASSET_CODE_LENGTH))
    }
    if (config.updateProfile === undefined) {
        throw new Error(errors.TXInfoError())
    }
    if (config.updateProfile.name) {
        checkFieldType(config.updateProfile, 'name', ['string'], false)
    }
    if (config.updateProfile.symbol) {
        checkFieldType(config.updateProfile, 'symbol', ['string'], false)
    }
    if (config.updateProfile.description) {
        checkFieldType(config.updateProfile, 'description', ['string'], false)
        checkMaxLength(config.updateProfile, 'description', 256)
    }
    if (config.updateProfile.suggestedGasLimit) {
        checkFieldType(config.updateProfile, 'suggestedGasLimit', ['string'], true)
    }
    if (config.updateProfile.freeze) {
        checkFieldType(config.updateProfile, 'freeze', ['boolean', 'string'], false)
        if (typeof config.updateProfile.freeze === 'string' && (config.updateProfile.freeze !== 'true' && config.updateProfile.freeze !== 'false')) {
            throw new Error(errors.TxInvalidSymbol('freeze'))
        }
    }
}

export function verifyTransferAssetInfo(config) {
    if (config.assetId === undefined) {
        throw new Error(errors.TXParamMissingError('assetId'))
    }
    checkFieldType(config, 'assetId', ['string'], false)
    if (config.assetId.length !== TX_ASSET_ID_LENGTH) {
        throw new Error(errors.TXInvalidLength('assetId', config.assetId, TX_ASSET_ID_LENGTH))
    }
    checkFieldType(config, 'transferAmount', ['string'], true)
    checkNegative(config, 'transferAmount')
}

export function verifyGasInfo(noGasTx, gasPrice, gasLimit) {
    checkFieldType(noGasTx, 'gasPayer', ['string'], false)
    // verify address
    checkAddress(noGasTx.gasPayer)
    checkType(gasPrice, 'gasPrice', ['number', 'string'], true)
    checkNegative(gasPrice, 'gasPrice')
    checkType(gasLimit, 'gasLimit', ['number', 'string'], true)
    checkNegative(gasLimit, 'gasLimit')
}

export function verifyModifySignersInfo(modifySignersInfo) {
    if (!modifySignersInfo || !modifySignersInfo.signers || !modifySignersInfo.signers.length) {
        throw new Error(errors.FieldIsRequired('signers'))
    }
    checkFieldType(modifySignersInfo, 'signers', ['array'], false)
    modifySignersInfo.signers.forEach((signer, index) => {
        checkType(signer.address, `signers[${index}].address`, ['string'], false)
        checkAddress(signer.address)
        checkType(signer.weight, `signers[${index}].weight`, ['number'], true)
        checkNegative(signer.weight, `signers[${index}].weight`)
    })
}

export function verifyBoxTXInfo(subTxList) {
    checkType(subTxList, 'subTxList', ['array'], false)
    subTxList.forEach(item => {
        let obj
        if (typeof item === 'string') {
            obj = JSON.parse(item)
        } else {
            obj = item
        }
        // 子交易在创建的时候已经校验过了，参数类型会修改，所以在箱子交易内部不进行校验
        if (Number(obj.type) === TxType.BOX_TX) {
            throw new Error(errors.InvalidBoxTransaction())
        }
        verifyTxConfig(obj)
    })
}

export function verifyContractCreationInfo(code, constructorArgs) {
    checkType(code, 'codeHex', ['string'], true)
    checkType(constructorArgs, 'constructorArgsHex', ['string'], true)
}

export function verifySignDeepLinkConfig(config) {
    if (!config || !config.message && !config.data) {
        throw new Error(errors.InvalidSignDeepLink())
    }
    if (config.message && config.data) {
        throw new Error(errors.InvalidSignDeepLink())
    }
    if (config.message) {
        checkFieldType(config, 'message', ['string'], false)
    }
    if (config.data) {
        checkFieldType(config, 'data', ['string'], false)
    }
    if (config.signer) {
        checkFieldType(config, 'signer', ['string'], false)
        checkAddress(config.signer)
    }
    if (config.receiver) {
        checkFieldType(config, 'receiver', ['string'], false)
    }
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {Array} types
 * @param {boolean} isNumber If the type is string, then it must be a number string
 */
function checkFieldType(obj, fieldName, types, isNumber) {
    return checkType(obj[fieldName], fieldName, types, isNumber)
}

/**
 * @param {object} data
 * @param {string} dataName
 * @param {Array} types
 * @param {boolean} isNumber If the type is string, then it must be a number string
 */
function checkType(data, dataName, types, isNumber) {
    const typeStr = typeof data
    for (let i = 0; i < types.length; i++) {
        if (types[i] === 'array' && Array.isArray(data)) {
            return
        }
        if (typeStr === types[i]) {
            // Type is correct now. Check number characters before we leave
            if (typeStr === 'string' && isNumber) {
                const isHex = has0xPrefix(data)
                if (isHex && !/^0x[0-9a-f]*$/i.test(data)) {
                    throw new Error(errors.TXMustBeNumber(dataName, data))
                }
                if (!isHex && !/^\d+$/.test(data)) {
                    throw new Error(errors.TXMustBeNumber(dataName, data))
                }
            }
            return
        }
        const isClassType = typeof types[i] === 'object' || typeof types[i] === 'function'
        if (isClassType && data instanceof types[i]) {
            return
        }
    }
    throw new Error(errors.TXInvalidType(dataName, data, types))
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {number} from
 * @param {number} to
 */
function checkRange(obj, fieldName, from, to) {
    let data = obj[fieldName]
    // convert all string to number
    if (typeof data === 'string') {
        data = parseInt(data, has0xPrefix(data) ? 16 : 10)
    }
    if (typeof data !== 'number') {
        throw new Error(errors.TXCanNotTestRange(fieldName, obj[fieldName]))
    }

    if (data < from || data > to) {
        throw new Error(errors.TXInvalidRange(fieldName, obj[fieldName], from, to))
    }
}

/**
 * @param {object} obj
 * @param {string} fieldName
 * @param {number} maxLength
 */
function checkMaxLength(obj, fieldName, maxLength) {
    const data = obj[fieldName]
    if (data.length > maxLength) {
        throw new Error(errors.TXInvalidMaxLength(fieldName, obj[fieldName], maxLength))
    }
}

/**
 * @param {string} str
 * @param {string} strName
 * @param {number} maxBytesLength
 */
function checkBytesLength(str, strName, maxBytesLength) {
    let dataLen = str.length
    dataLen = Math.ceil(dataLen / 2 - (has0xPrefix(str) ? 1 : 0))
    if (dataLen > maxBytesLength) {
        throw new Error(errors.TXInvalidMaxBytes(strName, str, maxBytesLength, dataLen))
    }
}

/**
 * @param {object} obj
 * @param {string} fieldName
 */
function checkNegative(obj, fieldName) {
    if (typeof obj[fieldName] === 'number' && obj[fieldName] < 0) {
        throw new Error(errors.TXNegativeError(fieldName))
    }
    if (typeof obj[fieldName] === 'string' && (obj[fieldName].startsWith('-'))) {
        throw new Error(errors.TXNegativeError(fieldName))
    }
}

function checkAddress(address) {
    const errMsg = verifyAddress(address)
    if (errMsg) {
        throw new Error(errMsg)
    }
}

function checkEmail(email) {
    if (!/^([a-zA-Z0-9_-]+\.?)+@([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9]{2,4}$/.test(email)) {
        throw new Error(errors.InvalidEmail(email))
    }
}
