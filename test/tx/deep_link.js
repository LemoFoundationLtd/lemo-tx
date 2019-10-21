import {assert} from 'chai'
import {parseDeepLink, createPayDeepLink, createSignDeepLink} from '../../lib/tx/deep_link'
import {DeepLinkType} from '../../lib/const'
import {txInfo, testAddr, dataSigs} from '../datas'
import errors from '../../lib/errors'

describe('deep_link', () => {
    it('normal_txConfig', () => {
        const txConfig = {
            ...txInfo.txConfig,
            gasPayer: testAddr,
            sigs: dataSigs,
            gasPayerSigs: dataSigs,
            receiver: 'http://lemochain.com/a?b=c',
        }
        const uri = createPayDeepLink(txConfig)
        const paseResult = parseDeepLink(uri)
        assert.equal(paseResult.data.chainID, txConfig.chainID)
        assert.equal(paseResult.data.version, txConfig.version)
        assert.equal(paseResult.data.type, txConfig.type)
        assert.equal(paseResult.data.to, txConfig.to)
        assert.equal(paseResult.data.toName, txConfig.toName)
        assert.equal(paseResult.data.gasPrice, txConfig.gasPrice)
        assert.equal(paseResult.data.gasLimit, txConfig.gasLimit)
        assert.equal(paseResult.data.amount.toString(), txConfig.amount)
        assert.equal(paseResult.data.data, txConfig.data)
        assert.equal(paseResult.data.expirationTime, txConfig.expirationTime)
        assert.equal(paseResult.data.message, txConfig.message)
        assert.equal(paseResult.data.from, txConfig.from)
        assert.equal(paseResult.data.gasPayer, txConfig.gasPayer)
        assert.deepEqual(paseResult.data.gasPayerSigs, txConfig.gasPayerSigs)
        assert.deepEqual(paseResult.data.sigs, txConfig.sigs)
        assert.equal(paseResult.data.receiver, txConfig.receiver)
        assert.equal(paseResult.deepLinkType, DeepLinkType.PAY)
    })
    // only has one sig in Array
    it('sigs_only_one', () => {
        const txConfig = {
            ...txInfo.txConfig,
            gasPayer: testAddr,
            sigs: txInfo.gasAfterSign,
            gasPayerSigs: txInfo.gasAfterSign,
        }
        const uri = createPayDeepLink(txConfig)
        const paseResult = parseDeepLink(uri)
        assert.deepEqual(paseResult.data.sigs, txConfig.sigs)
    })
    // txConfig have not from
    it('txConfig_no_from', () => {
        const txConfig = {
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            chainID: 100,
        }
        const uri = createPayDeepLink(txConfig)
        const parsedConfig = parseDeepLink(uri)
        assert.deepEqual(txConfig, parsedConfig.data)
    })
    // txConfig have not from
    it('uri_contains_invalid_property', () => {
        const uri = 'lemo://pay?c=100&t=123456'
        assert.throws(() => {
            parseDeepLink(uri)
        }, errors.InvalidAddress('123456'))
    })
    // txConfig is not string
    it('uri_is_not_string', () => {
        const uri = 123
        assert.throws(() => {
            parseDeepLink(uri)
        }, errors.InvalidDeepLink(123))
    })
    // txConfig is empty
    it('empty_config', () => {
        const txConfig = {}
        assert.throws(() => {
            createPayDeepLink(txConfig)
        }, errors.InvalidParams())
    })
    // Initial url error
    it('uri_contains_invalid_prefix', () => {
        const url = 'demo://wallet/pay?c=100&f=Lemo888888888888888888888888888888888888'
        assert.throws(() => {
            parseDeepLink(url)
        }, errors.InvalidDeepLink(url))
    })
})
describe('sign_deep_link', () => {
    it('normal_message_config', () => {
        const config = {
            message: 'sign this message',
            signer: 'Lemo846Q4NQCKJ2YWY6GHTSQHC7K24JDC7CPCWYH',
            receiver: 'http://lemochain.com/a?b=c',
        }
        const uri = createSignDeepLink(config)
        const paseResult = parseDeepLink(uri)
        assert.equal(paseResult.data.message, config.message)
        assert.equal(paseResult.data.signer, config.signer)
        assert.equal(paseResult.data.receiver, config.receiver)
    })
    it('normal_data_config', () => {
        const config = {
            data: '0xabc',
        }
        const uri = createSignDeepLink(config)
        const paseResult = parseDeepLink(uri)
        assert.equal(paseResult.message, config.message)
        assert.equal(paseResult.signer, config.signer)
        assert.equal(paseResult.receiver, config.receiver)
    })
    // txConfig is empty
    it('empty_config', () => {
        const config = {}
        assert.throws(() => {
            createSignDeepLink(config)
        }, errors.InvalidSignDeepLink())
    })
    it('both_message_data_config', () => {
        const config = {
            message: 'sign this message',
            data: '0xabc',
        }
        assert.throws(() => {
            createSignDeepLink(config)
        }, errors.InvalidSignDeepLink())
    })
})
