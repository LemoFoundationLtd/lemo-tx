import Base64Url from 'base64-url'
import {Base64} from 'js-base64'
import Qs from 'qs'
import lemoUtils from 'lemo-utils'
import BigNumber from 'bignumber.js'

// 地址转换成对象
export function parseDeepLink(Url) {
    const txConfig = Qs.parse(Url.split('?')[1])
    const newTxConfig = {}
    for (const key in txConfig) {
        if (key === 'ty') {
            newTxConfig.type = parseInt(txConfig[key], 10)
        }
        if (key === 'v') {
            newTxConfig.version = parseInt(txConfig[key], 10)
        }
        if (key === 'c') {
            newTxConfig.chainID = parseInt(txConfig[key], 10)
        }
        if (key === 'f') {
            newTxConfig.from = txConfig[key]
        }
        if (key === 't') {
            newTxConfig.to = txConfig[key]
        }
        if (key === 'tn') {
            newTxConfig.toName = txConfig[key]
        }
        if (key === 'p') {
            newTxConfig.gasPayer = txConfig[key]
        }
        if (key === 'gp') {
            newTxConfig.gasPrice = new BigNumber(txConfig[key], 10).times(new BigNumber('1000000000', 10)).toString(10)
        }
        if (key === 'gl') {
            newTxConfig.gasLimit = parseInt(txConfig[key], 10)
        }
        if (key === 'a') {
            // 相当于amount*10^18
            newTxConfig.amount = lemoUtils.lemoToMo(txConfig[key]).toString(10)
        }
        if (key === 'd') {
            newTxConfig.data = txConfig[key]
        }
        if (key === 'e') {
            // 地址时间单位是秒，转换成对象是毫秒
            newTxConfig.expirationTime = 1000 * parseInt(txConfig[key], 10)
        }
        if (key === 'm') {
            // 先将safe url base64 替换成正常的base64，
            const messageBase64 = Base64Url.unescape(txConfig[key])
            // 将正常的base64解码
            newTxConfig.message = Base64.decode(messageBase64)
        }
        if (key === 's') {
            newTxConfig.sigs = txConfig[key]
        }
        if (key === 'gs') {
            newTxConfig.gasPayerSigs = txConfig[key]
        }
    }
    return newTxConfig
}
// 对象转支付地址
export function createDeepLink(txConfig) {
    const newTxConfig = {}
    for (const key in txConfig) {
        if (key === 'type') {
            newTxConfig.ty = txConfig[key]
        }
        if (key === 'chainId') {
            newTxConfig.c = txConfig[key]
        }
        if (key === 'sigs') {
            newTxConfig.s = txConfig[key]
        }
        if (key === 'gasPayerSigs') {
            newTxConfig.gs = txConfig[key]
        }

        if (key === 'version') {
            newTxConfig.v = txConfig[key]
        }
        if (key === 'from') {
            newTxConfig.f = txConfig[key]
        }
        if (key === 'to') {
            newTxConfig.t = txConfig[key]
        }
        if (key === 'toName') {
            newTxConfig.tn = txConfig[key]
        }
        if (key === 'gasPayer') {
            newTxConfig.p = txConfig[key]
        }
        if (key === 'gasPrice') {
            newTxConfig.gp = new BigNumber(txConfig[key], 10).dividedBy('1000000000', 10).toString(10)
        }
        if (key === 'gasLimit') {
            newTxConfig.gl = txConfig[key]
        }
        if (key === 'amount') {
            // 对象转地址，相当于amount 除10^18,即moToLemo
            newTxConfig.a = lemoUtils.moToLemo(txConfig[key]).toString(10)
        }
        if (key === 'data') {
            newTxConfig.d = txConfig[key]
        }
        if (key === 'expirationTime') {
            newTxConfig.e = parseInt(txConfig[key], 10) / 1000
        }
        if (key === 'message') {
            // 先将交易信息加密成base64
            const messageBase64 = Base64.encode(txConfig[key])
            // 再将base64替换成safe url base64
            newTxConfig.m = Base64Url.escape(messageBase64)
        }
    }
    return `lemo://pay/tx?${Qs.stringify(newTxConfig, {arrayFormat: 'brackets'})}`
}

