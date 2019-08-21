import LemoTx from '../../lib/index'

describe('create_deep_link', () => {
    it('toParam', () => {
        const url = LemoTx.createDeepLink({
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
        })
        console.log(url)
    })
})
