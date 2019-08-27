import Base64Url from 'base64-url'
import {Base64} from 'js-base64'
import lemoUtils from 'lemo-utils'
import BigNumber from 'bignumber.js'
import {CHAIN_ID_MAIN_NET, TX_DEFAULT_GAS_PRICE_UNIT, DEEP_LINK_PREFIX, DEFAULT_FROM_ADDRESS} from '../const'
import {verifyTxConfig} from './tx_helper'
import Tx from './tx'
import errors from '../errors'

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
    if (txConfig.c || !txConfig.c) {
        newTxConfig.chainID = parseInt(txConfig.c, 10) || CHAIN_ID_MAIN_NET
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
        newTxConfig.amount = lemoUtils.lemoToMo(txConfig.a).toString(10)
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
    return new Tx({from: DEFAULT_FROM_ADDRESS, ...newTxConfig})
}

/**
 * 对象转支付地址
 * @param {object} txConfig
 * @return {string}
 */
export function createDeepLink(txConfig) {
    const config = {chainID: CHAIN_ID_MAIN_NET, from: DEFAULT_FROM_ADDRESS, ...txConfig}
    verifyTxConfig(config)
    const newTxConfig = {}
    if (txConfig.type) {
        newTxConfig.ty = txConfig.type
    }
    if (txConfig.chainID || !txConfig.chainID) {
        newTxConfig.c = txConfig.chainID || CHAIN_ID_MAIN_NET
    }
    if (txConfig.sigs) {
        newTxConfig.s = txConfig.sigs
    }
    if (txConfig.gasPayerSigs) {
        newTxConfig.gs = txConfig.gasPayerSigs
    }
    if (txConfig.version) {
        newTxConfig.v = txConfig.version
    }
    if (txConfig.from) {
        newTxConfig.f = txConfig.from
    }
    if (txConfig.to) {
        newTxConfig.t = txConfig.to
    }
    if (txConfig.toName) {
        newTxConfig.tn = txConfig.toName
    }
    if (txConfig.gasPayer) {
        newTxConfig.p = txConfig.gasPayer
    }
    if (txConfig.gasPrice) {
        newTxConfig.gp = new BigNumber(txConfig.gasPrice, 10).dividedBy(TX_DEFAULT_GAS_PRICE_UNIT, 10).toString(10)
    }
    if (txConfig.gasLimit) {
        newTxConfig.gl = txConfig.gasLimit
    }
    if (txConfig.amount) {
        // 对象转地址，相当于amount 除10^18,即moToLemo
        newTxConfig.a = lemoUtils.moToLemo(txConfig.amount).toString(10)
    }
    if (txConfig.data) {
        newTxConfig.d = txConfig.data
    }
    if (txConfig.expirationTime) {
        newTxConfig.e = Math.floor(txConfig.expirationTime) / 1000
    }
    if (txConfig.message) {
        // 先将交易信息加密成base64
        const messageBase64 = Base64.encode(txConfig.message)
        // 再将base64替换成safe url base64
        newTxConfig.m = Base64Url.escape(messageBase64)
    }

    return stringifyToUri(newTxConfig)
}

/**
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
 * @param {string} uri
 * @return {object}
 */
function parseUri(uri) {
    if (!uri.startsWith(DEEP_LINK_PREFIX)) {
        throw new Error(errors.InvalidDeepLink(uri))
    }

    const object = {}
    // 截取?后面所有的参数
    const termArr = uri.slice(DEEP_LINK_PREFIX.length).split('&')
    termArr.forEach(param => {
        const [key, value] = param.split('=')
        if (object[key] === undefined) {
            object[key] = value
        } else {  // 表示这个键对应的值是一个数组
            object[key] = [value].concat(object[key])
        }
    })
    return object
}
