import {assert} from 'chai'
import {toBuffer} from 'lemo-utils'
import {chainID, testAddr, testPrivate, txInfo} from '../../datas'
import {createVote, createTempAddress, createBoxTx} from '../../../lib/tx/tx_factory'
import BoxTx from '../../../lib/tx/special_tx/box_tx'
import {TxType} from '../../../lib/const'
import errors from '../../../lib/errors'
import lemoTx from '../../../lib/index'

describe('box_tx', () => {
    // normal situation
    it('box_specialTx_normal', () => {
        // sign temp address
        const tempAddress = createTempAddress(txInfo.txConfig, '01234567')
        const signTemp = lemoTx.sign(testPrivate, tempAddress)
        // sign vote: this method has no data
        const vote = createVote(txInfo.txConfig)
        // need sign before put it in subTxList
        const signVote = lemoTx.sign(testPrivate, vote)
        const subTxList = [signTemp, signVote]
        const tx = new BoxTx({chainID, from: testAddr}, subTxList)
        assert.equal(tx.type, TxType.BOX_TX)
        assert.deepEqual(JSON.parse(toBuffer(tx.data).toString()).subTxList[0].sigs, JSON.parse(subTxList[0]).sigs)
    })
    it('box_tx_params_from_error', () => {
        // one of tx error: the second tx from is error
        const subTxList = [
            {
                type: 0,
                version: '1',
                chainID: '200',
                from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
                gasPrice: '3000000000',
                gasLimit: '2000000',
                amount: '0',
                expirationTime: '1544584596',
                sigs: ['0x9c9f62a8fe923c093b408141a4af6b2116969e13e09920dc789cad5b4601a9526ef9c0242520a22579385ede9a91c1480c936c35f55aed6bb0deca570a7e932101'],
                gasPayerSigs: [],
            },
            {
                type: 0,
                version: '1',
                chainID: '200',
                from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJDDDDD',
                gasPrice: '3000000000',
                gasLimit: '2000000',
                amount: '0',
                expirationTime: '1544584596',
                sigs: ['0x9c9f62a8fe923c093b408141a4af6b2116969e13e09920dc789cad5b4601a9526ef9c0242520a22579385ede9a91c1480c936c35f55aed6bb0deca570a7e932101'],
                gasPayerSigs: [],
            }]
        assert.throws(() => {
            // two sign box Tx
            new BoxTx({chainID, from: testAddr}, subTxList)
        }, errors.InvalidAddressCheckSum('Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJDDDDD'))
    })
    it('box_tx_include_boxTx', () => {
        const vote = createVote(txInfo.txConfig)
        const voteSig = lemoTx.sign(testPrivate, vote)
        const List = [voteSig]
        const boxTx = createBoxTx({chainID, from: testAddr}, List)
        const boxTxSig = lemoTx.sign(testPrivate, boxTx)
        const subTxList = [boxTxSig]
        assert.throws(() => {
            new BoxTx({chainID, from: testAddr}, subTxList)
        }, errors.InvalidBoxTransaction())
    })
})
