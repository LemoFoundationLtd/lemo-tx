import {Base64} from 'js-base64'
import {lemoToMo, moToLemo} from 'lemo-utils'
import BigNumber from 'bignumber.js'
import {TX_DEFAULT_GAS_PRICE_UNIT, DeepLinkType, DeepLinkConfig} from '../const'
import {verifyTxConfig, verifySignDeepLinkConfig} from './tx_helper'
import errors from '../errors'

// 深度链接默认from（为了通过verifyTxConfig校验）
const DEFAULT_FROM = 'Lemo888888888888888888888888888888888888'

/**
 * 地址转换成对象
 * @param {string} uri
 * @return {object}
 */
export function parseDeepLink(uri) {
    const {type, uriContent} = parseUri(uri)

    switch (type) {
        case DeepLinkType.PAY:
            return parsePayDeepLink(uriContent)
        case DeepLinkType.SIGN:
            return parseSignDeepLink(uriContent)
        default:
            throw errors.InvalidDeepLinkType(type)
    }
}

/**
 * 创建支付用的深度链接
 * @param {object} txConfig 待支付的交易信息
 * @return {string}
 */
export function createPayDeepLink(txConfig) {
    verifyTxConfig({from: DEFAULT_FROM, ...txConfig})

    const newTxConfig = {}
    if (notEmpty(txConfig.type)) {
        newTxConfig.ty = txConfig.type
    }
    if (txConfig.chainID) {
        newTxConfig.c = txConfig.chainID
    }
    if (txConfig.sigs) {
        newTxConfig.s = txConfig.sigs
    }
    if (txConfig.gasPayerSigs) {
        newTxConfig.gs = txConfig.gasPayerSigs
    }
    if (notEmpty(txConfig.version)) {
        newTxConfig.v = txConfig.version
    }
    if (notEmpty(txConfig.from)) {
        newTxConfig.f = txConfig.from
    }
    if (notEmpty(txConfig.to)) {
        newTxConfig.t = txConfig.to
    }
    if (notEmpty(txConfig.toName)) {
        newTxConfig.tn = txConfig.toName
    }
    if (notEmpty(txConfig.gasPayer)) {
        newTxConfig.p = txConfig.gasPayer
    }
    if (notEmpty(txConfig.gasPrice)) {
        newTxConfig.gp = new BigNumber(txConfig.gasPrice, 10).dividedBy(TX_DEFAULT_GAS_PRICE_UNIT, 10).toString(10)
    }
    if (notEmpty(txConfig.gasLimit)) {
        newTxConfig.gl = txConfig.gasLimit
    }
    if (notEmpty(txConfig.amount)) {
        // 对象转地址，相当于amount 除10^18,即moToLemo
        newTxConfig.a = moToLemo(txConfig.amount).toString(10)
    }
    if (notEmpty(txConfig.data)) {
        newTxConfig.d = txConfig.data
    }
    if (notEmpty(txConfig.expirationTime)) {
        newTxConfig.e = Math.floor(txConfig.expirationTime) / 1000
    }
    if (notEmpty(txConfig.message)) {
        // 加密成safe url base64
        newTxConfig.m = Base64.encodeURI(txConfig.message)
    }
    if (Object.keys(newTxConfig).length === 0) {
        throw new Error(errors.InvalidParams())
    }
    if (notEmpty(txConfig.receiver)) {
        newTxConfig.r = encodeURIComponent(txConfig.receiver)
    }
    return stringifyToUri(DeepLinkType.PAY, newTxConfig)
}

/**
 * 解析并构造支付链接用的交易信息
 * @param {object} uriContent 由深度链接解析得到的键值对
 * @return {object}
 */
export function parsePayDeepLink(uriContent) {
    // 此时得到一个简化字段的txConfig,然后替换成全名
    const txConfig = {}
    if (notEmpty(uriContent.ty)) {
        txConfig.type = parseInt(uriContent.ty, 10)
    }
    if (notEmpty(uriContent.v)) {
        txConfig.version = parseInt(uriContent.v, 10)
    }
    if (uriContent.c) {
        txConfig.chainID = parseInt(uriContent.c, 10)
    }
    if (notEmpty(uriContent.f)) {
        txConfig.from = uriContent.f
    }
    if (notEmpty(uriContent.t)) {
        txConfig.to = uriContent.t
    }
    if (notEmpty(uriContent.tn)) {
        txConfig.toName = uriContent.tn
    }
    if (notEmpty(uriContent.p)) {
        txConfig.gasPayer = uriContent.p
    }
    if (notEmpty(uriContent.gp)) {
        txConfig.gasPrice = new BigNumber(uriContent.gp, 10).times(TX_DEFAULT_GAS_PRICE_UNIT, 10).toString(10)
    }
    if (notEmpty(uriContent.gl)) {
        txConfig.gasLimit = parseInt(uriContent.gl, 10)
    }
    if (notEmpty(uriContent.a)) {
        // 相当于amount*10^18
        txConfig.amount = lemoToMo(uriContent.a).toString(10)
    }
    if (notEmpty(uriContent.d)) {
        txConfig.data = uriContent.d
    }
    if (notEmpty(uriContent.e)) {
        // 地址时间单位是秒，转换成对象是毫秒
        txConfig.expirationTime = 1000 * parseInt(uriContent.e, 10)
    }
    if (notEmpty(uriContent.m)) {
        txConfig.message = Base64.decode(uriContent.m)
    }
    if (uriContent.s) {
        txConfig.sigs = Array.isArray(uriContent.s) ? uriContent.s : [uriContent.s]
    }
    if (uriContent.gs) {
        txConfig.gasPayerSigs = Array.isArray(uriContent.gs) ? uriContent.gs : [uriContent.gs]
    }
    if (notEmpty(uriContent.r)) {
        txConfig.receiver = decodeURIComponent(uriContent.r)
    }

    // 验证将url地址转换为标准的txConfig的数据合法性
    verifyTxConfig({from: DEFAULT_FROM, ...txConfig})

    return txConfig
}

/**
 * 创建签名用的深度链接
 * @param {object} config
 * @param {string?} config.message 待签名的文本。和data字段互斥
 * @param {string?} config.data 待签名的16进制数据字符串，必须是0x开头。和message字段互斥
 * @param {string?} config.signer 限定必须使用该账户来签名，可以不填
 * @param {string?} config.receiver 将签名通过HTTP的POST请求发送到该地址
 * @return {string}
 */
export function createSignDeepLink(config) {
    verifySignDeepLinkConfig(config)

    const newConfig = {}
    if (notEmpty(config.message)) {
        // 加密成safe url base64
        newConfig.m = Base64.encodeURI(config.message)
    }
    if (notEmpty(config.data)) {
        // 加密成safe url base64
        newConfig.d = Base64.encodeURI(config.data)
    }

    if (notEmpty(config.signer)) {
        newConfig.s = config.signer
    }
    if (notEmpty(config.receiver)) {
        newConfig.r = encodeURIComponent(config.receiver)
    }

    if (Object.keys(newConfig).length === 0) {
        throw new Error(errors.InvalidParams())
    }
    return stringifyToUri(DeepLinkType.SIGN, newConfig)
}

/**
 * 解析签名用的数据
 * @param {object} uriContent 由深度链接解析得到的键值对
 * @return {object}
 */
export function parseSignDeepLink(uriContent) {
    // 此时得到一个简化字段的txConfig,然后替换成全名
    const config = {}
    if (notEmpty(uriContent.m)) {
        config.message = Base64.decode(uriContent.m)
    }
    if (notEmpty(uriContent.d)) {
        config.data = Base64.decode(uriContent.d)
    }
    if (notEmpty(uriContent.s)) {
        config.signer = uriContent.s
    }
    if (notEmpty(uriContent.r)) {
        config.receiver = decodeURIComponent(uriContent.r)
    }

    if (!config.message && !config.data) {
        throw new Error(errors.InvalidSignDeepLink())
    }

    return config
}

/**
 * @param {number} type
 * @param {object} obj
 * @return {string}
 */
function stringifyToUri(type, obj) {
    const termArr = []

    Object.entries(obj).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                termArr.push(`${key}=${item}`)
            })
        } else {
            termArr.push(`${key}=${value}`)
        }
    })

    const prefix = DeepLinkConfig.find(item => item.type === type).prefix
    return `${prefix}${termArr.join('&')}`
}

/**
 * @param {string} uri
 * @return {object}
 */
function parseUri(uri) {
    if (typeof uri !== 'string') {
        throw new Error(errors.InvalidDeepLink(uri))
    }
    const linkConfig = DeepLinkConfig.find(item => uri.toLowerCase().startsWith(item.prefix))
    if (!linkConfig) {
        throw new Error(errors.InvalidDeepLink(uri))
    }

    const object = {}
    // 截取?后面所有的参数
    const termArr = uri.slice(linkConfig.prefix.length).split('&')
    termArr.forEach(param => {
        const [key, value] = param.split('=')
        if (object[key] === undefined) {
            object[key] = value
        } else {  // 表示这个键对应的值是一个数组
            object[key] = [value].concat(object[key])
        }
    })
    return {
        type: linkConfig.type,
        uriContent: object,
    }
}

function notEmpty(number) {
    return number !== undefined && number !== ''
}
