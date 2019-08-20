import Base64Url from 'base64-url'
import {Base64} from 'js-base64'
import Qs from 'qs'
import lemoUtils from 'lemo-utils'
import BigNumber from './tx'

// 地址转换成对象
export function parseDeepLink(Url) {
    const txConfig = Qs.parse(Url.split('?')[1])
    const newTxConfig = {}
    for (const key in txConfig) {
        switch (key) {
            case 'ty':
                newTxConfig.type = parseInt(txConfig[key])
                break;
            case 'v':
                newTxConfig.version = parseInt(txConfig[key])
                break;
            case 'c':
                newTxConfig.chainID = parseInt(txConfig[key])
                break;
            case 'f':
                newTxConfig.from = txConfig[key]
                break;
            case 't':
                newTxConfig.to = txConfig[key]
                break;
            case 'tn':
                newTxConfig.toName = txConfig[key]
                break;
            case 'p':
                newTxConfig.gasPayer = txConfig[key]
                break;
            case 'gp':
                newTxConfig.gasPrice = new BigNumber(txConfig[key], 10).times(new BigNumber('1000000000', 10)).toString(10)
                break;
            case 'gl':
                newTxConfig.gasLimit = parseInt(txConfig[key])
                break;
            case 'a':
                // 相当于amount*10^18
                newTxConfig.amount = lemoUtils.lemoToMo(txConfig[key]).toString(10)
                break;
            case 'd':
                newTxConfig.data = txConfig[key]
                break;
            case 'e':
                // 地址时间单位是秒，转换成对象是毫秒
                newTxConfig.expirationTime = 1000 * parseInt(txConfig[key])
                break;
            case 'm':
                // 先将safe url base64 替换成正常的base64，
                const messageBase64 = Base64Url.unescape(txConfig[key])
                // 将正常的base64解码
                newTxConfig.message = Base64.decode(messageBase64)
                break
            case 's':
                newTxConfig.sigs = txConfig[key]
                break;
            case 'gs':
                newTxConfig.gasPayerSigs = txConfig[key]
                break
            default:
                break
        }
    }
    return newTxConfig
}

// 对象转支付地址
export function createDeepLink(txConfig) {
    const newTxConfig = {}
    for (const key in txConfig) {
        switch (key) {
            case 'type':
                newTxConfig.t = txConfig[key]
                break
            case 'chainID':
                newTxConfig.c = txConfig[key]
                break
            case 'sigs':
                newTxConfig.s = txConfig[key]
                break;
            case 'gasPayerSigs':
                newTxConfig.gs = txConfig[key]
                break
            case 'version':
                newTxConfig.v = txConfig[key]
                break
            case 'from':
                newTxConfig.f = txConfig[key]
                break
            case 'to':
                newTxConfig.t = txConfig[key]
                break
            case 'toName':
                newTxConfig.tn = txConfig[key]
                break
            case 'gasPayer':
                newTxConfig.p = txConfig[key]
                break
            case 'gasPrice':
                newTxConfig.gp = BigNumber(txConfig[key], 10).dividedBy('1000000000', 10).toString(10)
                break
            case 'gasLimit':
                newTxConfig.gl = txConfig[key]
                break
            case 'amount':
                // 对象转地址，相当于amount 除10^18,即moToLemo
                newTxConfig.a = lemoUtils.moToLemo(txConfig[key]).toString(10)
                break
            case 'data':
                newTxConfig.d = txConfig[key]
                break
            case 'expirationTime':
                newTxConfig.e = parseInt(txConfig[key]) / 1000
                break
            case 'message':
                // 先将交易信息加密成base64
                const messageBase64 = Base64.encode(txConfig[key])
                // 再将base64替换成safe url base64
                newTxConfig.m = Base64Url.escape(messageBase64)
                break
            default:
                break
        }
    }
    return ('http://lemo/?' + Qs.stringify(newTxConfig, {arrayFormat: 'brackets'}))
}

