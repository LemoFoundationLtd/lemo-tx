import {assert} from 'chai'
import BigNumber from 'bignumber.js'
import {toBuffer} from 'lemo-utils'
import Tx from '../../lib/tx/tx'
import errors from '../../lib/errors'
import {testPrivate, txInfos, chainID, testAddr, emptyTxInfo} from '../datas'
import {
    TxType,
    MAX_TX_TO_NAME_LENGTH,
    TX_SIG_BYTE_LENGTH,
    TX_VERSION,
    TTTL,
    TX_DEFAULT_GAS_LIMIT,
    TX_DEFAULT_GAS_PRICE,
    MAX_TX_MESSAGE_LENGTH,
} from '../../lib/const'
import Signer from '../../lib/tx/signer'

describe('Tx_new', () => {
    it('empty config', () => {
        assert.throws(() => {
            new Tx({})
        }, errors.TXFieldCanNotEmpty('from'))
    })
    it('minimal config', () => {
        const tx = new Tx({chainID, from: testAddr})
        assert.equal(tx.type, TxType.ORDINARY)
        assert.equal(tx.version, TX_VERSION)
        assert.equal(tx.chainID, chainID)
        assert.equal(tx.to, '')
        assert.equal(tx.toName, '')
        assert.equal(tx.gasPrice, TX_DEFAULT_GAS_PRICE)
        assert.equal(tx.gasLimit, TX_DEFAULT_GAS_LIMIT)
        assert.equal(tx.amount, 0)
        assert.equal(tx.data, '')
        assert.equal(tx.expirationTime, Math.floor(Date.now() / 1000) + TTTL)
        assert.equal(tx.message, '')
        assert.deepEqual(tx.sigs, [])
        assert.deepEqual(tx.gasPayerSigs, [])
        assert.equal(tx.from, testAddr)
    })

    it('full config', () => {
        const config = {
            chainID,
            from: testAddr,
            type: 100,
            version: 101,
            to: 'Lemo837J796DDHYTQTRTQDT7B4QJJ9B6H559BCCT',
            toName: '103',
            gasPrice: 104,
            gasLimit: 105,
            amount: 106,
            data: '107',
            expirationTime: 108,
            message: '109',
            sigs: ['0x0110'],
            gasPayerSigs: ['0x01011'],
        }
        const tx = new Tx(config)
        assert.equal(tx.chainID, config.chainID)
        assert.equal(tx.type, config.type)
        assert.equal(tx.version, config.version)
        assert.equal(tx.to, config.to)
        assert.equal(tx.toName, config.toName)
        assert.equal(tx.gasPrice, config.gasPrice)
        assert.equal(tx.gasLimit, config.gasLimit)
        assert.equal(tx.amount, config.amount)
        assert.equal(tx.data, `0x${config.data}`)
        assert.equal(tx.expirationTime, config.expirationTime)
        assert.equal(tx.message, config.message)
        assert.deepEqual(tx.sigs, config.sigs)
        assert.deepEqual(tx.gasPayerSigs, config.gasPayerSigs)
        assert.equal(tx.from, config.from)
    })

    it('Tx_from', () => {
        const obj = {
            chainID: '1',
            expirationTime: '1541649536',
            from: testAddr,
        }
        const tx = new Tx(obj)
        tx.sig = new Signer().sign(tx, testPrivate)
        assert.equal(tx.from, obj.from)
        assert.equal(typeof tx.from, 'string')
    })
    it('Tx_no_from', () => {
        const obj = {
            chainID: '1',
            expirationTime: '1541649536',
        }
        assert.throws(() => {
            new Tx(obj)
        }, errors.TXFieldCanNotEmpty('from'))
    })
})

describe('Tx_serialize', () => {
    it('without signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlp, `inedx=${i}`)
        })
    })
    it('with signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.signWith(testPrivate)
            assert.equal(`0x${tx.serialize().toString('hex')}`, test.rlpAfterSign, `index=${i}`)
        })
    })
})

describe('Tx_hash', () => {
    it('without signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            assert.equal(tx.hash(), test.hash, `index=${i}`)
        })
    })
    it('with signature', () => {
        txInfos.forEach((test, i) => {
            const tx = new Tx(test.txConfig)
            tx.signWith(testPrivate)
            assert.equal(tx.hash(), test.hashAfterSign, `index=${i}`)
        })
    })
})

describe('Tx_expirationTime', () => {
    it('default expiration', () => {
        const before = Math.floor(Date.now() / 1000)
        const tx = new Tx({chainID, from: testAddr})
        const after = Math.floor(Date.now() / 1000)
        assert.isAtLeast(tx.expirationTime, before + TTTL)
        assert.isAtMost(tx.expirationTime, after + TTTL)
    })
})

describe('Tx_signWith', () => {
    it('sigWith_sigs_length', () => {
        const tx = new Tx(emptyTxInfo.txConfig)
        assert.equal(emptyTxInfo.txConfig.sigs, undefined)
        tx.signWith(testPrivate)
        assert.equal(tx.sigs.length, 1)
        tx.signWith(testPrivate)
        assert.equal(tx.sigs.length, 1)
    })
})
describe('all config', () => {
    const tests = [
        {field: 'chainID', configData: undefined, result: 0},
        {field: 'chainID', configData: 1},
        {field: 'chainID', configData: 100},
        {field: 'chainID', configData: '10000', result: 10000},
        {field: 'chainID', configData: 'abc', error: errors.TXMustBeNumber('chainID', 'abc')},
        {field: 'chainID', configData: '', result: 0},
        {field: 'chainID', configData: 0},
        {field: 'chainID', configData: '0x10000', error: errors.TXInvalidRange('chainID', '0x10000', 1, 0xffff)},
        {field: 'type', configData: undefined, result: 0},
        {field: 'type', configData: 0},
        {field: 'type', configData: 1},
        {field: 'type', configData: 0xff},
        {field: 'type', configData: '', result: 0},
        {field: 'type', configData: '1', result: 1},
        {field: 'type', configData: 'abc', error: errors.TXMustBeNumber('type', 'abc')},
        {field: 'type', configData: -1, error: errors.TXInvalidRange('type', -1, 0, 0xffff)},
        {field: 'type', configData: 0x10000, error: errors.TXInvalidRange('type', 0x10000, 0, 0xffff)},
        {field: 'version', configData: undefined, result: TX_VERSION},
        {field: 'version', configData: 0, result: 0},
        {field: 'version', configData: 1},
        {field: 'version', configData: 0xff},
        {field: 'version', configData: '', result: TX_VERSION},
        {field: 'version', configData: '1', result: 1},
        {field: 'version', configData: 'abc', error: errors.TXMustBeNumber('version', 'abc')},
        {field: 'version', configData: -1, error: errors.TXInvalidRange('version', -1, 0, 0xff)},
        {field: 'version', configData: 0x100, error: errors.TXInvalidRange('version', 0x100, 0, 0xff)},
        {field: 'to', configData: undefined, result: ''},
        {field: 'to', configData: ''},
        {field: 'to', configData: 0x1, error: errors.TXInvalidType('to', 0x1, ['string'])},
        {field: 'to', configData: '0x1', error: errors.InvalidAddress('0x1')},
        {field: 'to', configData: 'lemobw'},
        {field: 'to', configData: 'lemob', error: errors.InvalidAddressCheckSum('lemob')},
        {
            field: 'to',
            configData: 'Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S',
            error: errors.InvalidAddressLength('Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S'),
        },
        {field: 'toName', configData: undefined, result: ''},
        {field: 'toName', configData: ''},
        {field: 'toName', configData: 'lemo'},
        {
            field: 'toName',
            configData: new Array(101).fill(1).join(''),
            error: errors.TXInvalidMaxLength(
                'toName',
                new Array(101).fill(1).join(''),
                MAX_TX_TO_NAME_LENGTH,
            ),
        },
        {field: 'toName', configData: 'testname\ndads\n', error: errors.InvalidToName()},
        {field: 'gasPrice', configData: undefined, result: new BigNumber(TX_DEFAULT_GAS_PRICE)},
        {field: 'gasPrice', configData: 0, result: new BigNumber(0)},
        {field: 'gasPrice', configData: 1, result: new BigNumber(1)},
        {field: 'gasPrice', configData: 0xff, result: new BigNumber(0xff)},
        {field: 'gasPrice', configData: '', result: new BigNumber(TX_DEFAULT_GAS_PRICE)},
        {field: 'gasPrice', configData: '1', result: new BigNumber(1)},
        {field: 'gasPrice', configData: 'abc', error: errors.TXMustBeNumber('gasPrice', 'abc')},
        {field: 'gasPrice', configData: -1, error: errors.TXNegativeError('gasPrice')},
        {field: 'gasPrice', configData: '-1', error: errors.TXMustBeNumber('gasPrice', '-1')},
        {field: 'gasLimit', configData: undefined, result: TX_DEFAULT_GAS_LIMIT},
        {field: 'gasLimit', configData: 0},
        {field: 'gasLimit', configData: 1},
        {field: 'gasLimit', configData: 0xff},
        {field: 'gasLimit', configData: '', result: TX_DEFAULT_GAS_LIMIT},
        {field: 'gasLimit', configData: '1', result: 1},
        {field: 'gasLimit', configData: 'abc', error: errors.TXMustBeNumber('gasLimit', 'abc')},
        {field: 'gasLimit', configData: -1, error: errors.TXNegativeError('gasLimit')},
        {field: 'gasLimit', configData: '-1', error: errors.TXMustBeNumber('gasLimit', '-1')},
        {field: 'amount', configData: undefined, result: new BigNumber(0)},
        {field: 'amount', configData: 0, result: new BigNumber(0)},
        {field: 'amount', configData: 1, result: new BigNumber(1)},
        {field: 'amount', configData: 0xff, result: new BigNumber(0xff)},
        {field: 'amount', configData: '', result: new BigNumber(0)},
        {field: 'amount', configData: '1', result: new BigNumber(1)},
        {field: 'amount', configData: 'abc', error: errors.TXMustBeNumber('amount', 'abc')},
        {field: 'amount', configData: -1, error: errors.TXNegativeError('amount')},
        {field: 'amount', configData: '-1', error: errors.TXMustBeNumber('amount', '-1')},
        {field: 'expirationTime', configData: undefined, result: Math.floor(Date.now() / 1000) + TTTL},
        {field: 'expirationTime', configData: 0, result: Math.floor(Date.now() / 1000) + TTTL},
        {field: 'expirationTime', configData: 1},
        {field: 'expirationTime', configData: 0xff},
        {field: 'expirationTime', configData: '', result: Math.floor(Date.now() / 1000) + TTTL},
        {field: 'expirationTime', configData: '1', result: 1},
        {field: 'expirationTime', configData: 'abc', error: errors.TXMustBeNumber('expirationTime', 'abc')},
        {field: 'expirationTime', configData: -1, error: errors.TXNegativeError('expirationTime')},
        {field: 'expirationTime', configData: '-1', error: errors.TXMustBeNumber('expirationTime', '-1')},
        {field: 'data', configData: undefined, result: ''},
        {field: 'data', configData: ''},
        {field: 'data', configData: null, result: ''},
        {field: 'data', configData: 0, error: errors.TXInvalidType('data', 0, ['string', 'object'])},
        {field: 'data', configData: 'abc', error: errors.TXMustBeNumber('data', 'abc')},
        {field: 'data', configData: '0xabc'},
        {field: 'data', configData: {}, result: '0x7b7d'},
        {field: 'data', configData: {a: 12, b: [{c: 'a'}]}, result: '0x7b2261223a31322c2262223a5b7b2263223a2261227d5d7d'},
        {field: 'data', configData: toBuffer(0x0123), result: '0x0123'},
        {field: 'message', configData: undefined, result: ''},
        {field: 'message', configData: ''},
        {field: 'message', configData: 'testname\ndad<2j398!>\'😋'},
        {field: 'message', configData: 1, error: errors.TXInvalidType('message', 1, ['string'])},
        {
            field: 'message',
            configData: new Array(1025).fill(1).join(''),
            error: errors.TXInvalidMaxLength(
                'message',
                new Array(1025).fill(1).join(''),
                MAX_TX_MESSAGE_LENGTH,
            ),
        },
        {field: 'sigs', configData: [], result: []},
        {field: 'sigs', configData: ['0'], result: ['0x0']},
        {field: 'sigs', configData: ['1'], result: ['0x1']},
        {field: 'sigs', configData: ['4294967295'], result: ['0x4294967295']},
        {field: 'sigs', configData: ['0x']},
        {field: 'sigs', configData: ['0x0']},
        {field: 'sigs', configData: ['0x1']},
        {field: 'sigs', configData: ['0xffffffff', '0x12111111']},
        {field: 'sigs', configData: 1, error: errors.TXInvalidType('sigs', 1, ['array'])},
        {field: 'sigs', configData: 'abc', error: errors.TXInvalidType('sigs', 'abc', ['array'])},
        {field: 'sigs', configData: '0xxyz', error: errors.TXInvalidType('sigs', '0xxyz', ['array'])},
        {field: 'sigs', configData: '-1', error: errors.TXInvalidType('sigs', '-1', ['array'])},
        {
            field: 'sigs',
            configData:
                ['0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'],
            error: errors.TXInvalidMaxBytes(
                'sigs[0]',
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
        {field: 'gasPayerSigs', configData: [], result: []},
        {field: 'gasPayerSigs', configData: ['0'], result: ['0x0']},
        {field: 'gasPayerSigs', configData: ['1'], result: ['0x1']},
        {field: 'gasPayerSigs', configData: ['4294967295'], result: ['0x4294967295']},
        {field: 'gasPayerSigs', configData: ['0x']},
        {field: 'gasPayerSigs', configData: ['0x0']},
        {field: 'gasPayerSigs', configData: ['0x1']},
        {field: 'gasPayerSigs', configData: ['0xffffffff']},
        {field: 'gasPayerSigs', configData: 'abc', error: errors.TXInvalidType('gasPayerSigs', 'abc', ['array'])},
        {field: 'gasPayerSigs', configData: '0xxyz', error: errors.TXInvalidType('gasPayerSigs', '0xxyz', ['array'])},
        {field: 'gasPayerSigs', configData: '-1', error: errors.TXInvalidType('gasPayerSigs', '-1', ['array'])},
        {
            field: 'gasPayerSigs',
            configData:
                ['0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'],
            error: errors.TXInvalidMaxBytes(
                'gasPayerSigs[0]',
                '0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
                TX_SIG_BYTE_LENGTH,
                66,
            ),
        },
        {field: 'from', configData: undefined, error: errors.TXFieldCanNotEmpty('from')},
        {field: 'from', configData: '', error: errors.TXFieldCanNotEmpty('from')},
        {field: 'from', configData: 0x1, error: errors.TXInvalidType('from', 0x1, ['string'])},
        {field: 'from', configData: '0x1', error: errors.InvalidAddress('0x1')},
        {field: 'from', configData: 'lemobw'},
        {field: 'from', configData: 'lemob', error: errors.InvalidAddressCheckSum('lemob')},
        {
            field: 'from',
            configData: 'Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S',
            error: errors.InvalidAddressLength('Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S'),
        },
        {field: 'gasPayer', configData: undefined, result: ''},
        {field: 'gasPayer', configData: ''},
        {field: 'gasPayer', configData: 0x1, error: errors.TXInvalidType('gasPayer', 0x1, ['string'])},
        {field: 'gasPayer', configData: '0x1', result: 'Lemo8888888888888888888888888888888888BW', error: errors.InvalidAddress('0x1')},
        {field: 'gasPayer', configData: 'lemobw'},
        {field: 'gasPayer', configData: 'lemob', error: errors.InvalidAddressCheckSum('lemob')},
        {
            field: 'gasPayer',
            configData: 'Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S',
            error: errors.InvalidAddressLength('Lemo9A9JGWQT74H37PSB24RTH6YYHG6W3GCH3CJ8S'),
        },
    ]
    tests.forEach(test => {
        it(`set ${test.field} to ${JSON.stringify(test.configData)}`, () => {
            const config = {chainID, from: testAddr, [test.field]: test.configData}
            if (test.error) {
                assert.throws(() => {
                    new Tx(config)
                }, test.error)
            } else {
                const tx = new Tx(config)
                if (typeof test.result === 'undefined') {
                    assert.deepStrictEqual(tx[test.field], test.configData)
                } else if (test.field === 'expirationTime') {
                    assert.isAtLeast(tx.expirationTime, test.result)
                    assert.isAtMost(tx.expirationTime, test.result + 2)
                } else {
                    assert.deepStrictEqual(tx[test.field], test.result)
                }
            }
        })
    })
})
