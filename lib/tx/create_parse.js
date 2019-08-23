import {LEMO_URL} from '../const'

export function create(newTxConfig) {
    let url = ''
    for (const key in newTxConfig) {
        if (Array.isArray(newTxConfig[key])) {
            for (const item in newTxConfig[key]) {
                url += `${key}=${newTxConfig[key][item]}&`
            }
        } else {
            url += `${key}=${newTxConfig[key]}&`
        }
    }
    // 由于最后一个字符里面还有&符号，需要去掉
    url = `${LEMO_URL}${url}`
    return url.substring(0, url.length - 1)
}

export function parse(url) {
    const txConfig = {}
    // 截取?后面所有的参数
    const txArr = url.split('?')[1].split('&')
    txArr.forEach(param => {
        const [key, value] = param.split('=')
        if (txConfig[key] === undefined) {
            txConfig[key] = value
        } else {  // 表示这个键对应的值是一个数组
            txConfig[key] = [value].concat(txConfig[key])
        }
    })
    return txConfig
}
