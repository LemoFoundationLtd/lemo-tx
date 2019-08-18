import {assert} from 'chai'
import {decodeUtf8Hex} from 'lemo-utils'
import {chainID, testAddr} from '../../datas'
import errors from '../../../lib/errors'
import ModifySignersTx from '../../../lib/tx/special_tx/modify_signers_tx'
import {TxType} from '../../../lib/const'

function parseHexObject(hex) {
    return JSON.parse(decodeUtf8Hex(hex))
}

describe('Modify_signers', () => {
    const signers = [{
        address: testAddr,
        weight: 50,
    }, {
        address: 'Lemo83G97KK2GY4CYJHT3KPGWSQ5BBY942HC798Y',
        weight: 60,
    }]
    // normal situation
    it('modify_normal', () => {
        const tx = new ModifySignersTx({chainID, from: testAddr}, signers)
        assert.equal(tx.type, TxType.MODIFY_SIGNER)
        assert.deepEqual(parseHexObject(tx.data).signers, signers)
    })
})

describe('Modify-signers_miss_address', () => {
    const signers = [{
        weight: 50,
    }, {
        address: 'Lemo83G97KK2GY4CYJHT3KPGWSQ5BBY942HC798Y',
        weight: 60,
    }]
    // miss address
    it('miss_address', () => {
        assert.throws(() => {
            new ModifySignersTx({chainID, from: testAddr}, signers)
        }, errors.TXInvalidType('signers[0].address', undefined, ['string']))
    })
})

describe('Modify-signers_miss_weight', () => {
    const signers = [{
        address: testAddr,
    }, {
        address: 'Lemo83G97KK2GY4CYJHT3KPGWSQ5BBY942HC798Y',
        weight: 60,
    }]
    // miss weight
    it('miss_weight', () => {
        assert.throws(() => {
            new ModifySignersTx({chainID, from: testAddr}, signers)
        }, errors.TXInvalidType('signers[0].weight', undefined, ['number']))
    })
})

describe('Modify_signers_empty', () => {
    const signers = []
    assert.throws(() => {
        new ModifySignersTx({chainID, from: testAddr}, signers)
    }, errors.TXFieldCanNotEmpty('signers'))
})
