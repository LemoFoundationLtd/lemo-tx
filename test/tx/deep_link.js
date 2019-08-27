import {assert} from 'chai'
import LemoTx from '../../lib/index'
import BigNumber from 'bignumber.js'

describe('create_deep_link', () => {
    it('full_config', () => {
        const txConfig = {
            type: 1,
            version: 2,
            chainID: 100,
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            toName: 'accouneName',
            gasPrice: new BigNumber('12683784', 10).toString(),
            expirationTime: 1516561000,
            sigs: ['7sdu', '5dt6eu', '5dgye'],
            gasPayerSigs: ['5hf65gf', 'h65hd'],
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?ty=1&c=100&s=7sdu&s=5dt6eu&s=5dgye&gs=5hf65gf&gs=h65hd&v=2&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=accouneName&gp=0.012683784&e=1516561')
    })
    it('empty_config', () => {
        const txConfig = {}
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1')
    })
    it('chainID_config', () => {
        const txConfig = {
            chainID: 100,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=100')
    })
    it('type_config', () => {
        const txConfig = {
            type: 1,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?ty=1&c=1')
    })
    it('version_config', () => {
        const txConfig = {
            version: 2,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&v=2')
    })
    it('to_config', () => {
        const txConfig = {
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&t=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('tn_config', () => {
        const txConfig = {
            toName: 'Lemo1234',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&tn=Lemo1234')
    })
    it('p_config', () => {
        const txConfig = {
            gasPayer: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&p=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D')
    })
    it('gp_config', () => {
        const txConfig = {
            gasPrice: 1234,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&gp=0.000001234')
    })
    it('gl_config', () => {
        const txConfig = {
            gasLimit: 37858,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&gl=37858')
    })
    it('a_config', () => {
        const txConfig = {
            amount: 12345546,
        }
        assert.equal(LemoTx.createDeepLink(txConfig), 'lemo://pay/tx?c=1&a=0.000000000012345546')
    })
})

describe('parse_deep_link', () => {
    // it('empty_url', () => {
    //     const url = 'lemo://pay/tx?f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D'
    //
    //     const txConfig = '{"type":"0","version":"1","chainID":"1","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"3000000000","gasLimit":"2000000","amount":"0","expirationTime":"1566816641","sigs":[],"gasPayerSigs":[]}'
    //     assert.deepEqual(LemoTx.parseDeepLink(url).toString(), txConfig)
    // })
    it('full_url', () => {
        const url = 'lemo://pay/tx?ty=1&c=100&s=7sdu&s=5dt6eu&s=5dgye&gs=5hf65gf&gs=h65hd&v=2&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&t=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=accouneName&p=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&gp=2345.645465656&gl=1342&a=100.01&d=0x15&e=1516561&m=dGhpcyBpcyBhIGV4YW1wbGU'

        const txConfig = '{"type":"1","version":"2","chainID":"100","from":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","gasPrice":"2345645465656","gasLimit":"1342","amount":"100010000000000000000","expirationTime":"1516561000","gasPayer":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","to":"Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D","toName":"accouneName","data":"0x15","message":"this is a example","sigs":["0x5dgye","0x5dt6eu","0x7sdu"],"gasPayerSigs":["0xh65hd","0x5hf65gf"]}'

        assert.deepEqual(LemoTx.parseDeepLink(url).toString(), txConfig)
    })
})
