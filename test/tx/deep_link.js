import {assert} from 'chai'
import LemoTx from '../../lib/index'

describe('create_deep_link', () => {
    it('empty_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })

    it('chainID_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            chainID: 100,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=100&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('type_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            type: 1,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?ty=1&c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('version_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            version: 2,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&v=2&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('to_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&t=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('tn_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            toName: 'Lemo1234',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=Lemo1234')
    })
    it('p_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            gasPayer: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&p=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('gp_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            gasPrice: 1234,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&gp=0.000001234')
    })
    it('gl_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            toName: 'Lemo1234',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=Lemo1234')
    })
    it('tn_config', () => {
        const txConfig = {
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            toName: 'Lemo1234',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=Lemo1234')
    })
})

describe('', () => {
    it('', () => {
    })
})
