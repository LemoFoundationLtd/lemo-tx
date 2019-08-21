import LemoTx from '../../lib/index'

describe('create_deep_link', () => {
    it('create_deep_link', () => {
        const txConfig = {
            type: 1,
            chainID: 1,
            version: 2,
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            to: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            toName: 'accouneName',
            gasPayer: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            gasPrice: 2345645465656,
            gasLimit: 1342,
            amount: 100010000000000000000,
            data: '0x3gsdsy',
            expirationTime: 1516561000,
            message: 'this is a example',
        }
        for (const key in txConfig) {
            const url = LemoTx.createDeepLink({[key]: txConfig[key]})
            console.log(url)
        }
    })
    it('parse_deep_link', () => {
        const txConfig = LemoTx.parseDeepLink('lemo://pay/tx?ty=1&c=1&v=2&f=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&t=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&tn=accouneName&p=Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D&gp=2345.645465656&gl=1342&a=100.01&d=0x3gsdsy&e=1516561&m=dGhpcyBpcyBhIGV4YW1wbGU&s%5B%5D=7sdu&s%5B%5D=5dt6eu&s%5B%5D=5dgye&gs%5B%5D=5hf65gf&gs%5B%5D=h65hd')
        console.log(txConfig)
    })
})
