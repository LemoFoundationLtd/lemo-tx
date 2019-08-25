import {createTempAddress as toTempAddress} from 'lemo-utils'
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

/**
 * Create a special transaction to set vote target
 * @param {object} txConfig Transaction config
 * @return {VoteTx}
 */
export function createVote(txConfig) {
    return new VoteTx(txConfig)
}

/**
 * Create a special transaction to register or edit candidate information
 * @param {object} txConfig Transaction config
 * @param {object} candidateInfo Candidate information
 * @return {CandidateTx}
 */
export function createCandidate(txConfig, candidateInfo) {
    return new CandidateTx(txConfig, candidateInfo)
}

/**
 * 创建资产的交易
 * @param {object} txConfig Transaction config
 * @param {object} createAssetInfo CreateAsset information
 * @return {CreateAssetTx}
 */
export function createAsset(txConfig, createAssetInfo) {
    return new CreateAssetTx(txConfig, createAssetInfo)
}

/**
 * 创建发行资产的交易
 * @param {object} txConfig Transaction config
 * @param {object} issueAssetInfo IssueAsset information
 * @return {IssueAssetTx}
 */
export function createIssueAsset(txConfig, issueAssetInfo) {
    return new IssueAssetTx(txConfig, issueAssetInfo)
}

/**
 * 创建交易资产交易
 * @param {object} txConfig Transaction config
 * @param {object} transferAssetInfo TransferAsset information
 * @return {TransferAssetTx}
 */
export function createTransferAsset(txConfig, transferAssetInfo) {
    return new TransferAssetTx(txConfig, transferAssetInfo)
}

/**
 * 创建增发资产的交易
 * @param {object} txConfig Transaction config
 * @param {object} replenishInfo TransferAsset information
 * @return {ReplenishAssetTx}
 */
export function createReplenishAsset(txConfig, replenishInfo) {
    return new ReplenishAssetTx(txConfig, replenishInfo)
}

/**
 * 创建修改资产
 * @param {object} txConfig Transaction config
 * @param {object} modifyInfo TransferAsset information
 * @return {modifyAssetTx}
 */
export function createModifyAsset(txConfig, modifyInfo) {
    return new ModifyAssetTx(txConfig, modifyInfo)
}

/**
 * free gas transaction sign
 * @param {object} txConfig Transaction config
 * @param {string} payer the address of the transaction gas
 * @return {GasTx}
 */
export function createNoGas(txConfig, payer) {
    return new GasTx(txConfig, payer)
}

/**
 * Reimbursement gas transaction
 * @param {string} noGasTxStr returned by the signNoGas method
 * @param {number|string} gasPrice Gas price for smart contract. Unit is mo/gas
 * @param {number|string} gasLimit Max gas limit for smart contract. Unit is gas
 * @return {ReimbursementTx}
 */
export function createReimbursement(noGasTxStr, gasPrice, gasLimit) {
    const noGasTx = JSON.parse(noGasTxStr)
    return new ReimbursementTx(noGasTx, gasPrice, gasLimit)
}

/**
 * Create temp address
 * @param {object} txConfig Transaction config
 * @param {string} userId User id
 * @return {modifySignersTx}
 */
export function createTempAddress(txConfig, userId) {
    const tempConfig = {
        ...txConfig,
        to: toTempAddress(txConfig.from, userId),
    }
    const signers = [{
        address: tempConfig.from,
        weight: 100,
    }]
    return new ModifySignersTx(tempConfig, signers)
}

/**
 * 创建修改多重签名
 * @param {object} txConfig Transaction config
 * @param {Array} signers list
 * @return {modifySignersTx}
 */
export function createModifySigners(txConfig, signers) {
    return new ModifySignersTx(txConfig, signers)
}

/**
 * Create a special transaction to set box target
 * @param {object} txConfig Transaction config
 * @param {Array} subTxList Box transaction information
 * @return {BoxTx}
 */
export function createBoxTx(txConfig, subTxList) {
    return new BoxTx(txConfig, subTxList)
}

/**
 * Create a special transaction to set box target
 * @param {object} txConfig Transaction config
 * @param {string} codeHex contract contract hexadecimal code
 * @param {string} constructorArgsHex contract contract hexadecimal params
 * @return {ContractCreationTx}
 */
export function createContractCreation(txConfig, codeHex, constructorArgsHex) {
    return new ContractCreationTx(txConfig, codeHex, constructorArgsHex)
}
