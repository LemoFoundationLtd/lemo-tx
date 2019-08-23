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

describe('parse_deep_link', () => {
    it('empty_url', () => {
        const url = 'lemo://pay/tx?f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
        assert.deepEqual(LemoTx.parseDeepLink(url), {chainID: 1, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'})
    })
    it('full_url', () => {
        const url = 'lemo://pay/tx?ty=100&c=1&s=7sdu&s=5dt6eu&s=5dgye&gs=5hf65gf&gs=h65hd&v=2&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&t=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=accouneName&p=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&gp=2345.645465656&gl=1342&a=100.01&d=0x15&e=1516561&m=dGhpcyBpcyBhIGV4YW1wbGU'
        assert.deepEqual(LemoTx.parseDeepLink(url), {
            type: 100,
            chainID: 1,
            version: 2,
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            toName: 'accouneName',
            gasPayer: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            gasPrice: '2345645465656',
            gasLimit: 1342,
            amount: '100010000000000000000',
            data: '0x15',
            expirationTime: 1516561000,
            message: 'this is a example',
            sigs: ['7sdu', '5dt6eu', '5dgye'],
            gasPayerSigs: ['5hf65gf', 'h65hd'],
        })
    })
    it('chainID_url', () => {
        const url = 'lemo://pay/tx?c=100&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
        assert.deepEqual(LemoTx.parseDeepLink(url), {chainID: 100, from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'})
    })
})
