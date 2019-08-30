import Base64Url from 'base64-url'
import {Base64} from 'js-base64'
import {lemoToMo, moToLemo} from 'lemo-utils'
import BigNumber from 'bignumber.js'
import {TX_DEFAULT_GAS_PRICE_UNIT, DEEP_LINK_PREFIX} from '../const'
import {verifyTxConfig} from './tx_helper'
import Tx from './tx'
import errors from '../errors'

// 深度链接默认from（为了通过verifyTxConfig校验）
const DEFAULT_FROM = 'Lemo888888888888888888888888888888888888'

/**
 * 地址转换成对象
 * @param {string} url
 * @return {Tx}
 */
export function parseDeepLink(url) {
    const txConfig = parseUri(url)

    // 此时得到一个简化字段的txConfig,然后替换成全名
    const newTxConfig = {}
    if (txConfig.ty) {
        newTxConfig.type = parseInt(txConfig.ty, 10)
    }
    if (txConfig.v) {
        newTxConfig.version = parseInt(txConfig.v, 10)
    }
    if (txConfig.c) {
        newTxConfig.chainID = parseInt(txConfig.c, 10)
    }
    if (txConfig.f) {
        newTxConfig.from = txConfig.f
    }
    if (txConfig.t) {
        newTxConfig.to = txConfig.t
    }
    if (txConfig.tn) {
        newTxConfig.toName = txConfig.tn
    }
    if (txConfig.p) {
        newTxConfig.gasPayer = txConfig.p
    }
    if (txConfig.gp) {
        newTxConfig.gasPrice = new BigNumber(txConfig.gp, 10).times(TX_DEFAULT_GAS_PRICE_UNIT, 10).toString(10)
    }
    if (txConfig.gl) {
        newTxConfig.gasLimit = parseInt(txConfig.gl, 10)
    }
    if (txConfig.a) {
        // 相当于amount*10^18
        newTxConfig.amount = lemoToMo(txConfig.a).toString(10)
    }
    if (txConfig.d) {
        newTxConfig.data = txConfig.d
    }
    if (txConfig.e) {
        // 地址时间单位是秒，转换成对象是毫秒
        newTxConfig.expirationTime = 1000 * parseInt(txConfig.e, 10)
    }
    if (txConfig.m) {
        // 先将safe url base64 替换成正常的base64，
        const messageBase64 = Base64Url.unescape(txConfig.m)
        // 将正常的base64解码
        newTxConfig.message = Base64.decode(messageBase64)
    }
    if (txConfig.s) {
        newTxConfig.sigs = txConfig.s
    }
    if (txConfig.gs) {
        newTxConfig.gasPayerSigs = txConfig.gs
    }

    // 验证将url地址转换为标准的txConfig的数据合法性
    return new Tx(newTxConfig)
}

/**
 * 对象转支付地址
 * @param {object} txConfig
 * @return {string}
 */
export function createDeepLink(txConfig) {
    const config = {from: DEFAULT_FROM, ...txConfig}
    verifyTxConfig(config)

    const newTxConfig = {}
    if (config.type) {
        newTxConfig.ty = config.type
    }
    if (config.chainID) {
        newTxConfig.c = config.chainID
    }
    if (config.sigs) {
        newTxConfig.s = config.sigs
    }
    if (config.gasPayerSigs) {
        newTxConfig.gs = config.gasPayerSigs
    }
    if (config.version) {
        newTxConfig.v = config.version
    }
    if (config.from) {
        newTxConfig.f = config.from
    }
    if (config.to) {
        newTxConfig.t = config.to
    }
    if (config.toName) {
        newTxConfig.tn = config.toName
    }
    if (config.gasPayer) {
        newTxConfig.p = config.gasPayer
    }
    if (config.gasPrice) {
        newTxConfig.gp = new BigNumber(config.gasPrice, 10).dividedBy(TX_DEFAULT_GAS_PRICE_UNIT, 10).toString(10)
    }
    if (config.gasLimit) {
        newTxConfig.gl = config.gasLimit
    }
    if (config.amount) {
        // 对象转地址，相当于amount 除10^18,即moToLemo
        newTxConfig.a = moToLemo(config.amount).toString(10)
    }
    if (config.data) {
        newTxConfig.d = config.data
    }
    if (config.expirationTime) {
        newTxConfig.e = Math.floor(config.expirationTime) / 1000
    }
    if (config.message) {
        // 先将交易信息加密成base64
        const messageBase64 = Base64.encode(config.message)
        // 再将base64替换成safe url base64
        newTxConfig.m = Base64Url.escape(messageBase64)
    }

    return stringifyToUri(newTxConfig)
}

/**
 * 将txConfig通过&拼接成字符串
 * @param {object} obj
 * @return {string}
 */
function stringifyToUri(obj) {
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

    return `${DEEP_LINK_PREFIX}${termArr.join('&')}`
}

/**
 * 解析字符串成txConfig对象
 * @param {string} url
 * @return {object}
 */
function parseUri(url) {
    if (!url.startsWith(DEEP_LINK_PREFIX)) {
        throw new Error(errors.InvalidDeepLink(url))
    }

    const object = {}
    // 截取?后面所有的参数
    const termArr = url.slice(DEEP_LINK_PREFIX.length).split('&')
    termArr.forEach(param => {
        const [key, value] = param.split('=')
        if (object[key] === undefined) {
            if (key === 's' || key === 'gs') {
                object[key] = [value]
            } else {
                object[key] = value
            }
        } else {  // 表示这个键对应的值是一个数组
            object[key] = [value].concat(object[key])
        }
    })
    return object
}
