import lemoUtils from 'lemo-utils'
import Tx from './tx'
import VoteTx from './special_tx/vote_tx'
import CandidateTx from './special_tx/candidate_tx'
import CreateAssetTx from './special_tx/create_asset_tx'
import IssueAssetTx from './special_tx/issue_asset_tx'
import TransferAssetTx from './special_tx/transfer_asset_tx'
import ReplenishAssetTx from './special_tx/replenish_asset_tx'
import ModifyAssetTx from './special_tx/modify_asset_tx'
import GasTx from './special_tx/gas_tx'
import ReimbursementTx from './special_tx/gas_reimbursement_tx'
import ModifySignersTx from './special_tx/modify_signers_tx'
import BoxTx from './special_tx/box_tx'
import ContractCreationTx from './special_tx/contract_creation_tx'
import errors from '../errors'

/**
 * Sign transaction and return the config which used to call lemo.tx.send
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @return {string}
 */
export function sign(privateKey, txConfig) {
    const tx = new Tx(txConfig)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * Sign a special transaction to set vote target
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @return {string}
 */
export function signVote(privateKey, txConfig) {
    const tx = new VoteTx(txConfig)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * Sign a special transaction to register or edit candidate information
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {object} candidateInfo Candidate information
 * @return {string}
 */
export function signCandidate(privateKey, txConfig, candidateInfo) {
    const tx = new CandidateTx(txConfig, candidateInfo)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * 签名创建资产的交易
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {object} createAssetInfo CreateAsset information
 * @return {string}
 */
export function signCreateAsset(privateKey, txConfig, createAssetInfo) {
    const tx = new CreateAssetTx(txConfig, createAssetInfo)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * 签名发行资产的交易
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {object} issueAssetInfo IssueAsset information
 * @return {string}
 */
export function signIssueAsset(privateKey, txConfig, issueAssetInfo) {
    const tx = new IssueAssetTx(txConfig, issueAssetInfo)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * 签名交易资产交易
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {object} transferAssetInfo TransferAsset information
 * @return {string}
 */
export function signTransferAsset(privateKey, txConfig, transferAssetInfo) {
    const tx = new TransferAssetTx(txConfig, transferAssetInfo)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * 签名增发资产的交易
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {object} replenishInfo TransferAsset information
 * @return {string}
 */
export function signReplenishAsset(privateKey, txConfig, replenishInfo) {
    const tx = new ReplenishAssetTx(txConfig, replenishInfo)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * 签名修改资产
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {object} modifyInfo TransferAsset information
 * @return {string}
 */
export function signModifyAsset(privateKey, txConfig, modifyInfo) {
    const tx = new ModifyAssetTx(txConfig, modifyInfo)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * free gas transaction sign
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {string} payer the address of the transaction gas
 * @return {string}
 */
export function signNoGas(privateKey, txConfig, payer) {
    const tx = new GasTx(txConfig, payer)
    tx.signNoGasWith(privateKey)
    return tx.toString()
}

/**
 * Reimbursement gas transaction
 * @param {string} privateKey The private key from sender account
 * @param {string} noGasTxStr returned by the signNoGas method
 * @param {number|string} gasPrice Gas price for smart contract. Unit is mo/gas
 * @param {number|string} gasLimit Max gas limit for smart contract. Unit is gas
 * @return {string}
 */
export function signReimbursement(privateKey, noGasTxStr, gasPrice, gasLimit) {
    const noGasTx = JSON.parse(noGasTxStr)
    if (lemoUtils.privateKeyToAddress(privateKey) !== noGasTx.gasPayer) {
        throw new Error(errors.InvalidAddressConflict(noGasTx.gasPayer))
    }
    const tx = new ReimbursementTx(noGasTx, gasPrice, gasLimit)
    tx.signGasWith(privateKey)
    return tx.toString()
}

/**
 * Create temp address
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {string} userId User id
 * @return {string}
 */
export function signCreateTempAddress(privateKey, txConfig, userId) {
    const tempConfig = {
        ...txConfig,
        to: lemoUtils.createTempAddress(txConfig.from, userId),
    }
    const signers = [{
        address: tempConfig.from,
        weight: 100,
    }]
    const tx = new ModifySignersTx(tempConfig, signers)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * 签名修改多重签名
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {Array} signers list
 * @return {string}
 */
export function signModifySigners(privateKey, txConfig, signers) {
    const tx = new ModifySignersTx(txConfig, signers)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * Sign a special transaction to set box target
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {Array} subTxList Box transaction information
 * @return {string}
 */
export function signBoxTx(privateKey, txConfig, subTxList) {
    const tx = new BoxTx(txConfig, subTxList)
    tx.signWith(privateKey)
    return tx.toString()
}

/**
 * Sign a special transaction to set box target
 * @param {string} privateKey The private key from sender account
 * @param {object} txConfig Transaction config
 * @param {string} codeHex contract contract hexadecimal code
 * @param {string} constructorArgsHex contract contract hexadecimal params
 * @return {string}
 */
export function signContractCreation(privateKey, txConfig, codeHex, constructorArgsHex) {
    const tx = new ContractCreationTx(txConfig, codeHex, constructorArgsHex)
    tx.signWith(privateKey)
    return tx.toString()
}

export default {
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
}
