import {assert} from 'chai'
import {testAddr, txInfo} from '../../datas'
import GasTx from '../../../lib/tx/special_tx/gas_tx'
import errors from '../../../lib/errors'

describe('GasTx_new', () => {
    const txConfig = {
        ...txInfo.txConfig,
    }
    it('payer is LemoAddress', () => {
        const tx = new GasTx(txConfig, testAddr)
        assert.equal(tx.gasLimit, txConfig.gasLimit)
        assert.equal(tx.data, txConfig.data)
        assert.equal(tx.gasPayer, testAddr)
    })
    it('no payer', () => {
        const tx = new GasTx(txConfig)
        assert.equal(tx.gasPayer, '')
    })
    it('payer is encodeAddress', () => {
        const payer = '0x015780F8456F9c1532645087a19DcF9a7e0c7F97'
        assert.throws(() => {
            new GasTx(txConfig, payer)
        }, errors.InvalidAddress(payer))
    })
})
