import Base64Url from 'base64-url'
import {Base64} from 'js-base64'
import Qs from 'qs'
import lemoUtils from 'lemo-utils'
import BigNumber from 'bignumber.js'
import {CHAIN_ID_MAIN_NET} from '../const.js'
import {verifyTxConfig} from './tx_helper.js'

// 地址转换成对象
export function parseDeepLink(Url) {
    const txConfig = Qs.parse(Url.split('?')[1])
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
        newTxConfig.gasPrice = new BigNumber(txConfig.gp, 10).times(new BigNumber('1000000000', 10)).toString(10)
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
    verifyTxConfig(newTxConfig)
    return newTxConfig
}

// 对象转支付地址
export function createDeepLink(txConfig) {
    const newTxConfig = {}
    if (txConfig.type) {
        newTxConfig.ty = txConfig.type
    }
    if (txConfig.chainID || !txConfig.chainID) {
        console.log(CHAIN_ID_MAIN_NET)
        txConfig.chainID = txConfig.chainID || CHAIN_ID_MAIN_NET
        newTxConfig.c = txConfig.chainID
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
        newTxConfig.gp = new BigNumber(txConfig.gasPrice, 10).dividedBy('1000000000', 10).toString(10)
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
        newTxConfig.e = parseInt(txConfig.expirationTime, 10) / 1000
    }
    if (txConfig.message) {
        // 先将交易信息加密成base64
        const messageBase64 = Base64.encode(txConfig.message)
        // 再将base64替换成safe url base64
        newTxConfig.m = Base64Url.escape(messageBase64)
    }
    verifyTxConfig(txConfig)
    return `lemo://pay/tx?${Qs.stringify(newTxConfig, {arrayFormat: 'brackets'})}`.replace(/%5B%5D/g, '')
}

