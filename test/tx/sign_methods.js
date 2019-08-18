import {assert} from 'chai'
import {decodeUtf8Hex, toBuffer, encodeAddress, decodeAddress} from 'lemo-utils'
import {
    txInfos,
    testPrivate,
    txInfo,
    testAddr,
    emptyTxInfo,
    bigTxInfo,
} from '../datas'
import {
    sign,
    signVote,
    signCandidate,
    signCreateAsset,
    signIssueAsset,
    signTransferAsset,
    signReplenishAsset,
    signModifyAsset,
    signNoGas,
    signReimbursement,
    signCreateTempAddress,
    signModifySigners,
    signBoxTx,
    signContractCreation,
} from '../../lib/tx/sign_methods'
import errors from '../../lib/errors'
import {TxType} from '../../lib/const'

function parseHexObject(hex) {
    return JSON.parse(decodeUtf8Hex(hex))
}

describe('sign', () => {
    it('sign_normal', () => {
        let result = sign(testPrivate, bigTxInfo.txConfig)
        result = JSON.parse(result)
        assert.equal(result.from, bigTxInfo.txConfig.from)
    })
})

describe('signVote', () => {
    it('signVote_normal', () => {
        txInfos.forEach((test, i) => {
            let json = signVote(testPrivate, test.txConfig)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.VOTE, `index=${i}`)
            assert.equal(json.amount, 0, `index=${i}`)
            assert.equal(json.data, undefined, `index=${i}`)
        })
    })
})

describe('signCandidate', () => {
    it('signCandidate_normal', () => {
        txInfos.forEach((test, i) => {
            const candidateInfo = {
                isCandidate: true,
                minerAddress: 'Lemobw',
                nodeID:
                    '5e3600755f9b512a65603b38e30885c98cbac70259c3235c9b3f42ee563b480edea351ba0ff5748a638fe0aeff5d845bf37a3b437831871b48fd32f33cd9a3c0',
                host: '127.0.0.1',
                port: '7001',
                introduction: 'abcde',
            }
            let json = signCandidate(testPrivate, test.txConfig, candidateInfo)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.CANDIDATE, `index=${i}`)
            const result = JSON.stringify({...candidateInfo, isCandidate: String(candidateInfo.isCandidate)})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            assert.equal(json.to, undefined, `index=${i}`)
            assert.equal(json.toName, undefined, `index=${i}`)
        })
    })
})

describe('signCreateAsset', () => {
    it('signCreateAsset_normal', () => {
        txInfos.forEach((test, i) => {
            const createAssetInfo = {
                category: 1,
                decimal: 18,
                isReplenishable: true,
                isDivisible: true,
                profile: {
                    name: 'Demo Asset',
                    symbol: 'DT',
                    description: 'demo asset',
                    suggestedGasLimit: '60000',
                },
            }
            let json = signCreateAsset(testPrivate, test.txConfig, createAssetInfo)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.CREATE_ASSET, `index=${i}`)
            const result = JSON.stringify({...createAssetInfo, profile: {...createAssetInfo.profile, freeze: 'false'}})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            assert.equal(json.to, undefined, `index=${i}`)
            assert.equal(json.toName, undefined, `index=${i}`)
            assert.equal(json.amount, 0, `index=${i}`)
        })
    })
})

describe('signIssueAsset', () => {
    it('signIssueAsset_normal', () => {
        txInfos.forEach((test, i) => {
            const txConfig = {...test.txConfig}
            if (!txConfig.to) {
                txConfig.to = 'Lemo8888888888888888888888888888888888BW'
            }
            const issueAssetInfo = {
                assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                metaData: 'issue asset metaData',
                supplyAmount: '100000',
            }
            let json = signIssueAsset(testPrivate, txConfig, issueAssetInfo)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.ISSUE_ASSET, `index=${i}`)
            const result = JSON.stringify({...issueAssetInfo})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            assert.equal(json.toName, txConfig.toName, `index=${i}`)
            assert.equal(json.amount, 0, `index=${i}`)
        })
    })
})

describe('signReplenishAsset', () => {
    it('signReplenishAsset_normal', () => {
        txInfos.forEach((test, i) => {
            const replenishAssetInfo = {
                assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                replenishAmount: '100000',
            }
            let json = signReplenishAsset(testPrivate, test.txConfig, replenishAssetInfo)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.REPLENISH_ASSET, `index=${i}`)
            const result = JSON.stringify({...replenishAssetInfo})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            assert.equal(json.toName, test.txConfig.toName, `index=${i}`)
        })
    })
})

describe('signModifyAsset', () => {
    it('signModifyAsset_normal', () => {
        txInfos.forEach((test, i) => {
            const ModifyAssetInfo = {
                assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                updateProfile: {
                    name: 'Demo Asset',
                    symbol: 'DT',
                    description: 'demo asset',
                },
            }
            let json = signModifyAsset(testPrivate, test.txConfig, ModifyAssetInfo)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.MODIFY_ASSET, `index=${i}`)
            const result = JSON.stringify({...ModifyAssetInfo})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
        })
    })
})

describe('signTransferAsset', () => {
    it('signTransferAsset_normal', () => {
        const tests = [
            {...txInfos[0].txConfig, amount: 0},
            {...txInfos[1].txConfig, to: 'Lemobw'},
            {...txInfos[2].txConfig, amount: '117789804318558955305553166716194567721832259791707930541440413419507985'},
        ]
        return tests.forEach((test, i) => {
            const transferAsset = {
                assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
                transferAmount: '110000',
            }
            let json = signTransferAsset(testPrivate, test, transferAsset)
            json = JSON.parse(json)
            assert.equal(json.type, TxType.TRANSFER_ASSET, `index=${i}`)
            const result = JSON.stringify({...transferAsset})
            assert.equal(toBuffer(json.data).toString(), result, `index=${i}`)
            assert.equal(json.to, test.to ? encodeAddress(test.to) : undefined, `index=${i}`)
            assert.equal(json.toName, test.toName, `index=${i}`)
        })
    })
})

describe('signNoGas', () => {
    it('signNoGas_normal', () => {
        const txConfig = {
            ...txInfo.txConfig,
        }
        const noGasInfo = signNoGas(testPrivate, txConfig, testAddr)
        assert.equal(JSON.parse(noGasInfo).type, txConfig.type)
        assert.equal(JSON.parse(noGasInfo).gasPayer, testAddr)
        assert.equal(JSON.parse(noGasInfo).toName, txConfig.toName)
    })
})

describe('signReimbursement', () => {
    it('signReimbursement_normal', () => {
        const noGasInfo = signNoGas(testPrivate, txInfo.txConfig, testAddr)
        const result = signReimbursement(testPrivate, noGasInfo, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        assert.deepEqual(JSON.parse(result).gasPayerSigs, txInfo.gasAfterSign)
        assert.equal(JSON.parse(result).gasLimit, txInfo.txConfig.gasLimit)
        assert.equal(JSON.parse(result).gasPrice, txInfo.txConfig.gasPrice)
    })
    it('signReimbursement_payer_error', () => {
        const gasPayer = 'Lemo839J9N2H8QWS4JSSPCZZ4DTGGA9C8PC49YB8'
        const noGasInfo = signNoGas(testPrivate, txInfo.txConfig, gasPayer)
        assert.throws(() => {
            signReimbursement(testPrivate, noGasInfo, txInfo.txConfig.gasPrice, txInfo.txConfig.gasLimit)
        }, errors.InvalidAddressConflict(gasPayer))
    })
})

describe('signCreateTempAddress', () => {
    it('signCreateTempAddress_normal', () => {
        const userId = '0123456789'
        const result = signCreateTempAddress(testPrivate, txInfo.txConfig, userId)
        assert.equal(parseHexObject(JSON.parse(result).data).signers[0].address, txInfo.txConfig.from)
    })
    it('signCreateTempAddress_userID_short', () => {
        const userId = '112'
        const result = signCreateTempAddress(testPrivate, txInfo.txConfig, userId)
        assert.equal(parseHexObject(JSON.parse(result).data).signers[0].address, txInfo.txConfig.from)
    })
    it('signCreateTempAddress_userID_long', () => {
        const userId = '100000000000000000002'
        assert.throws(() => {
            signCreateTempAddress(testPrivate, txInfo.txConfig, userId)
        }, errors.TXInvalidUserIdLength())
    })
    it('signCreateTempAddress_contrast_from', () => {
        const result = signCreateTempAddress(testPrivate, txInfo.txConfig, '0123456789')
        const codeAddress = decodeAddress(JSON.parse(result).to)
        const codeFrom = decodeAddress(txInfo.txConfig.from)
        assert.equal(codeAddress.slice(4, 22), codeFrom.substring(codeFrom.length - 18))
    })
})
describe('signBoxTx', () => {
    it('boxTx_normal', () => {
        // sign create Asset tx
        const createAssetInfo = {
            category: 1,
            decimal: 18,
            isReplenishable: true,
            isDivisible: true,
            profile: {
                name: 'Demo Asset',
                symbol: 'DT',
                description: 'demo asset',
                suggestedGasLimit: '60000',
            },
        }
        const createAsset = signCreateAsset(testPrivate, emptyTxInfo.txConfig, createAssetInfo)
        // sign modify Asset tx
        const ModifyAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            updateProfile: {
                name: 'Demo Asset',
                symbol: 'DT',
                description: 'demo asset',
            },
        }
        const modifyAsset = signModifyAsset(testPrivate, bigTxInfo.txConfig, ModifyAssetInfo)
        // subTxInfo: one is string and the other is a object. Same expirationTime
        const subTxList = [createAsset, JSON.parse(modifyAsset)]
        const result = signBoxTx(testPrivate, txInfo.txConfig, subTxList)
        assert.deepEqual(JSON.parse(result).to, undefined)
        assert.deepEqual(parseHexObject(JSON.parse(result).data).subTxList[1], subTxList[1])
        assert.deepEqual(JSON.parse(result).expirationTime, subTxList[1].expirationTime)
    })
    it('boxTx_time_different', () => {
        // sign replenish Asset tx
        const replenishAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            assetId: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            replenishAmount: '100000',
        }
        const txConfig = {
            ...txInfo.txConfig,
            expirationTime: 1560513710327,
        }
        const replenishAsset = signReplenishAsset(testPrivate, txConfig, replenishAssetInfo)
        // sign modify Asset tx
        const ModifyAssetInfo = {
            assetCode: '0xd0befd3850c574b7f6ad6f7943fe19b212affb90162978adc2193a035ced8884',
            updateProfile: {
                name: 'Demo Asset',
                symbol: 'DT',
                description: 'demo asset',
            },
        }
        const modifyTxConfig = {
            ...bigTxInfo.txConfig,
            expirationTime: 1544584598,
        }
        const modifyAsset = signModifyAsset(testPrivate, modifyTxConfig, ModifyAssetInfo)
        // subTxInfo: two data are object. expirationTime is different
        const subTxList = [replenishAsset, modifyAsset]
        const result = signBoxTx(testPrivate, txInfo.txConfig, subTxList)
        // Compare the size of the expirationTime within a transaction
        const time = parseHexObject(JSON.parse(result).data).subTxList.map(item => item.expirationTime)
        assert.deepEqual(JSON.parse(result).expirationTime, Math.min(...time).toString())
    })
    it('box_tx_include_box', () => {
        // sign temp address
        const tempAddress = signCreateTempAddress(testPrivate, txInfo.txConfig, '01234567')
        // sign ordinary tx
        const ordinary = sign(testPrivate, emptyTxInfo.txConfig)
        const subTxList = [tempAddress, ordinary]
        // first sign box Tx
        const boxTx = signBoxTx(testPrivate, txInfo.txConfig, subTxList)
        const subTxLists = [tempAddress, ordinary, boxTx]
        assert.throws(() => {
            // two sign box Tx
            signBoxTx(testPrivate, txInfo.txConfig, subTxLists)
        }, errors.InvalidBoxTransaction())
    })
})

describe('signContractCreation', () => {
    // normal
    it('Contract_creation_normal', () => {
        const codeHex = '0x1003330000001'
        const constructorArgsHex = '0x000000001'
        const result = signContractCreation(testPrivate, txInfo.txConfig, codeHex, constructorArgsHex)
        assert.deepEqual(JSON.parse(result).type, TxType.CREATE_CONTRACT.toString())
        assert.deepEqual(JSON.parse(result).data.slice(0, codeHex.length), codeHex)
        const data = JSON.parse(result).data
        assert.deepEqual(data.slice(codeHex.length, data.length), constructorArgsHex.slice(2))
    })
    // Code starts with 0x, but it's not hex, constructorArgsHex is the same
    it('Contract_creation_code_noHex', () => {
        const codeHex = '0x000gbfdfggh000001'
        const constructorArgsHex = '0x000000001'
        assert.throws(() => {
            signContractCreation(testPrivate, txInfo.txConfig, codeHex, constructorArgsHex)
        }, errors.TXMustBeNumber('codeHex', '0x000gbfdfggh000001'))
    })
    // codeHex is number
    it('Contract_creation_code_number', () => {
        const codeHex = 23455467
        const constructorArgsHex = '0x000000001'
        assert.throws(() => {
            signContractCreation(testPrivate, txInfo.txConfig, codeHex, constructorArgsHex)
        }, errors.TXInvalidType('codeHex', 23455467, ['string']))
    })
})

describe('signModifySigners', () => {
    // normal
    it('Contract_creation_normal', () => {
        const signers = [{
            address: testAddr,
            weight: 50,
        }, {
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            weight: 60,
        }]
        let result = signModifySigners(testPrivate, txInfo.txConfig, signers)
        result = JSON.parse(result)
        const signerData = parseHexObject(result.data)
        assert.equal(result.type, TxType.MODIFY_SIGNER.toString())
        assert.deepEqual(signerData.signers, signers)
    })
    // no address
    it('Contract_creation_no_address', () => {
        const signers = [{
            address: testAddr,
            weight: 50,
        }, {
            address: '',
            weight: 60,
        }]
        assert.throws(() => {
            signModifySigners(testPrivate, txInfo.txConfig, signers)
        }, errors.InvalidAddress(''))
    })
    // no weight
    it('Contract_creation_no_weight', () => {
        const signers = [{
            address: testAddr,
        }, {
            address: 'Lemo83GN72GYH2NZ8BA729Z9TCT7KQ5FC3CR6DJG',
            weight: 60,
        }]
        assert.throws(() => {
            signModifySigners(testPrivate, txInfo.txConfig, signers)
        }, errors.TXInvalidType('signers[0].weight', undefined, ['number']))
    })
})
