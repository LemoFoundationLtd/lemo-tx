import {assert} from 'chai'
import Tx from '../lib/index'

describe('sign', () => {
    it('sign_normal', () => {
        const info = {
            chainID: 1,
            from: 'Lemo836BQKCBZ8Z7B7N4G4N4SNGBT24ZZSJQD24D',
            to: 'Lemo83BYKZJ4RN4TKC9C78RFW7YHW6S87TPRSH34',
            amount: 100,
        }
        const result = Tx.createVote(info)
        const sig = Tx.sign('0xc21b6b2fbf230f665b936194d14da67187732bf9d28768aef1a3cbb26608f8aa', result)
        assert.equal(JSON.parse(sig).to, info.to)
    })
})
