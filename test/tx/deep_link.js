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
        const stringifyResult = createDeepLink(txConfig)
        const paseResult = parseDeepLink(stringifyResult)
        assert.equal(paseResult.from, txConfig.from)
        assert.equal(paseResult.data, txConfig.data)
        assert.equal(paseResult.amount.toString(), txConfig.amount)
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
        const stringifyResult = createDeepLink(txConfig)
        const paseResult = parseDeepLink(stringifyResult)
        assert.deepEqual(paseResult.sigs, txConfig.sigs)
    })
    // txConfig have not from
    it('txConfig_no_from', () => {
        const txConfig = {
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            chainID: 100,
        }
        const result = createDeepLink(txConfig)
        assert.throws(() => {
            parseDeepLink(result)
        }, errors.TXFieldCanNotEmpty('from'))
    })
    // txConfig is empty
    it('empty_config', () => {
        const txConfig = {}
        assert.throws(() => {
            createDeepLink(txConfig)
        }, errors.TXFieldCanNotEmpty('txConfig'))
    })
    // Initial url error
    it('url_start_error', () => {
        const url = 'demo://pay/tx?c=100&f=Lemo888888888888888888888888888888888888'
        assert.throws(() => {
            parseDeepLink(url)
        }, errors.InvalidDeepLink(url))
    })
})
