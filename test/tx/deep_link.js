import {assert} from 'chai'
import {parseDeepLink, createDeepLink} from '../../lib/tx/deep_link'
import {txInfo, testAddr, dataSigs} from '../datas'
import errors from '../../lib/errors'

describe('deep_link', () => {
    it('normal_txConfig', () => {
        const txConfig = {
            ...txInfo.txConfig,
            gasPayer: testAddr,
            sigs: dataSigs,
            gasPayerSigs: dataSigs,
        }
        const uri = createDeepLink(txConfig)
        const paseResult = parseDeepLink(uri)
        assert.equal(paseResult.chainID, txConfig.chainID)
        assert.equal(paseResult.version, txConfig.version)
        assert.equal(paseResult.type, txConfig.type)
        assert.equal(paseResult.to, txConfig.to)
        assert.equal(paseResult.toName, txConfig.toName)
        assert.equal(paseResult.gasPrice, txConfig.gasPrice)
        assert.equal(paseResult.gasLimit, txConfig.gasLimit)
        assert.equal(paseResult.amount.toString(), txConfig.amount)
        assert.equal(paseResult.data, txConfig.data)
        assert.equal(paseResult.expirationTime, txConfig.expirationTime - (txConfig.expirationTime % 1000))
        assert.equal(paseResult.message, txConfig.message)
        assert.equal(paseResult.from, txConfig.from)
        assert.equal(paseResult.gasPayer, txConfig.gasPayer)
        assert.deepEqual(paseResult.gasPayerSigs, txConfig.gasPayerSigs)
        assert.deepEqual(paseResult.sigs, txConfig.sigs)
    })
    // only has one sig in Array
    it('sigs_only_one', () => {
        const txConfig = {
            ...txInfo.txConfig,
            gasPayer: testAddr,
            sigs: txInfo.gasAfterSign,
            gasPayerSigs: txInfo.gasAfterSign,
        }
        const uri = createDeepLink(txConfig)
        const paseResult = parseDeepLink(uri)
        assert.deepEqual(paseResult.sigs, txConfig.sigs)
    })
    // txConfig have not from
    it('txConfig_no_from', () => {
        const txConfig = {
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            chainID: 100,
        }
        const uri = createDeepLink(txConfig)
        const parsedConfig = parseDeepLink(uri)
        assert.deepEqual(txConfig, parsedConfig)
    })
    // txConfig have not from
    it('uri_contains_invalid_property', () => {
        const uri = 'lemo://pay/tx?c=100&t=123456'
        assert.throws(() => {
            parseDeepLink(uri)
        }, errors.InvalidAddress('123456'))
    })
    // txConfig is empty
    it('empty_config', () => {
        const txConfig = {}
        assert.throws(() => {
            createDeepLink(txConfig)
        }, errors.TXFieldCanNotEmpty('txConfig'))
    })
    // Initial url error
    it('uri_contains_invalid_prefix', () => {
        const url = 'demo://pay/tx?c=100&f=Lemo888888888888888888888888888888888888'
        assert.throws(() => {
            parseDeepLink(url)
        }, errors.InvalidDeepLink(url))
    })
})
