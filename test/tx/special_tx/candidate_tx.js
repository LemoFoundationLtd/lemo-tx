import {assert} from 'chai'
import {decodeUtf8Hex} from 'lemo-utils'
import CandidateTx from '../../../lib/tx/special_tx/candidate_tx'
import {chainID, from} from '../../datas'
import {TxType, NODE_ID_LENGTH, MAX_DEPUTY_FIELD_LENGTH, MAX_DEPUTY_LONG_FIELD_LENGTH} from '../../../lib/const'
import errors from '../../../lib/errors'

describe('CandidateTx_new', () => {
    const minCandidateInfo = {
        incomeAddress: 'lemobw',
        nodeID: '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        host: 'a.com',
        port: 7001,
        introduction: 'acsdusjkajkdaijadjskdei',
    }
    it('min config', () => {
        const tx = new CandidateTx({chainID, from}, minCandidateInfo)
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 0)
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({isCandidate: 'true', ...minCandidateInfo, port: minCandidateInfo.port.toString()}))
    })
    it('useless config', () => {
        const tx = new CandidateTx(
            {
                chainID,
                type: 100,
                to: 'lemobw',
                toName: 'alice',
                amount: 101,
                data: '102',
                from,
            },
            minCandidateInfo,
        )
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.amount, 101)
        assert.equal(decodeUtf8Hex(tx.data), JSON.stringify({isCandidate: 'true', ...minCandidateInfo, port: minCandidateInfo.port.toString()}))
    })
    it('useful config', () => {
        const candidateInfo = {
            isCandidate: true,
            ...minCandidateInfo,
        }
        const tx = new CandidateTx(
            {
                chainID,
                from,
                type: TxType.CANDIDATE,
                message: 'abc',
            },
            candidateInfo,
        )
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.message, 'abc')
        const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate), port: minCandidateInfo.port.toString()})
        assert.equal(decodeUtf8Hex(tx.data), result)
    })

    // test fields
    const tests = [
        {field: 'isCandidate', configData: false, result: 'false'},
        {field: 'isCandidate', configData: true, result: 'true'},
        {field: 'isCandidate', configData: 'true', error: errors.TXInvalidType('isCandidate', 'true', ['undefined', 'boolean'])},
        {field: 'incomeAddress', configData: 0x1, error: errors.TXInvalidType('incomeAddress', 0x1, ['string'])},
        {field: 'incomeAddress', configData: '', result: ''},
        {field: 'incomeAddress', configData: '123', error: errors.InvalidAddress('')},
        {field: 'incomeAddress', configData: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG'},
        {field: 'incomeAddress', configData: '0x1', error: errors.InvalidAddress('0x1')},
        {field: 'nodeID', configData: '123', error: errors.TXInvalidLength('nodeID', '123', NODE_ID_LENGTH)},
        {
            field: 'nodeID',
            configData:
                '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
        },
        {field: 'host', configData: 'aaa'},
        {
            field: 'host',
            configData: new Array(129).fill(1).join(''),
            error: errors.TXInvalidMaxLength(
                'host',
                new Array(129).fill(1).join(''),
                MAX_DEPUTY_FIELD_LENGTH,
            ),
        },
        {field: 'port', configData: '1'},
        {field: 'port', configData: '1001'},
        {field: 'port', configData: 0, error: errors.TXInvalidRange('port', 0, 1, 0xffff)},
        {field: 'port', configData: '0xfffff', error: errors.TXInvalidRange('port', '0xfffff', 1, 0xffff)},
        {field: 'port', configData: [123], error: errors.TXInvalidType('port', [123], ['string', 'number'])},
        {field: 'name', configData: 'node-1'},
        {field: 'name', configData: 123, error: errors.TXInvalidType('name', 123, ['string'])},
        {
            field: 'name',
            configData: new Array(129).fill(1).join(''),
            error: errors.TXInvalidMaxLength(
                'name',
                new Array(129).fill(1).join(''),
                MAX_DEPUTY_FIELD_LENGTH,
            ),
        },
        {field: 'teamName', configData: 'team-1'},
        {field: 'teamName', configData: 123, error: errors.TXInvalidType('teamName', 123, ['string'])},
        {
            field: 'teamName',
            configData: new Array(129).fill(1).join(''),
            error: errors.TXInvalidMaxLength(
                'teamName',
                new Array(129).fill(1).join(''),
                MAX_DEPUTY_FIELD_LENGTH,
            ),
        },
        {field: 'email', configData: 'a@b.com'},
        {field: 'email', configData: 'abc', error: errors.InvalidEmail('abc')},
        {field: 'email', configData: 123, error: errors.TXInvalidType('email', 123, ['string'])},
        {
            field: 'email',
            configData: `${new Array(129).fill(1).join('')}@b.com`,
            error: errors.TXInvalidMaxLength(
                'email',
                `${new Array(129).fill(1).join('')}@b.com`,
                MAX_DEPUTY_FIELD_LENGTH,
            ),
        },
        {field: 'introduction', configData: 'ab0000011111111'},
        {field: 'introduction', configData: ''},
        {field: 'introduction', configData: 'aaa👍a0%7&12\'a65"</>好f5748a6'},
        {
            field: 'introduction',
            configData: new Array(1025).fill(1).join(''),
            error: errors.TXInvalidMaxLength(
                'introduction',
                new Array(1025).fill(1).join(''),
                MAX_DEPUTY_LONG_FIELD_LENGTH,
            ),
        },
    ]
    tests.forEach(test => {
        it(`set candidateInfo.${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const candidateInfo = {
                ...minCandidateInfo,
                [test.field]: test.configData,
            }
            if (test.error) {
                assert.throws(() => {
                    new CandidateTx({chainID, from}, candidateInfo)
                }, test.error)
            } else {
                const tx = new CandidateTx({chainID, from}, candidateInfo)
                const targetField = JSON.parse(decodeUtf8Hex(tx.data))[test.field]
                if (typeof test.result !== 'undefined') {
                    assert.strictEqual(targetField, test.result)
                } else {
                    assert.strictEqual(targetField, test.configData)
                }
            }
        })
    })
})
describe('CandidateTx_host_empty', () => {
    it('min config', () => {
        const minCandidateInfo = {
            incomeAddress: 'lemobw',
            nodeID: '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            host: '',
            port: 7001,
        }
        assert.throws(() => {
            new CandidateTx({chainID, from}, minCandidateInfo)
        }, errors.FieldIsRequired('host'))
    })
})

describe('isCandidate', () => {
    it('isCandidate is false', () => {
        const candidateInfo = {
            isCandidate: false,
            nodeID: '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            host: '12313',
            port: 7001,
        }
        const tx = new CandidateTx(
            {
                chainID,
                from,
                type: TxType.CANDIDATE,
                message: 'abc',
            },
            candidateInfo,
        )
        assert.equal(tx.type, TxType.CANDIDATE)
        assert.equal(tx.message, 'abc')
        const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate), port: candidateInfo.port.toString()})
        assert.equal(decodeUtf8Hex(tx.data), result)
    })
    it('isCandidate is false and Useless information', () => {
        const candidateInfo = {
            isCandidate: false,
            incomeAddress: 'lemobw',
            nodeID: '0x5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
            host: '233343',
            port: 7001,
        }
        const tx = new CandidateTx(
            {
                chainID,
                from,
                type: TxType.CANDIDATE,
                message: 'abc',
            },
            candidateInfo,
        )
        const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
        assert.equal(decodeUtf8Hex(tx.data).isCandidate, result.isCandidate)
    })
})
