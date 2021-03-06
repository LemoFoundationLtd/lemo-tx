import {TxType} from '../../const'
import Tx from '../tx'
import {verifyCandidateInfo} from '../tx_helper'

export default class CandidateTx extends Tx {
    /**
     * Create a unsigned special transaction register or edit candidate information
     * @param {object} txConfig
     * @param {number?} txConfig.type The type of transaction. 0: normal
     * @param {number?} txConfig.version The version of transaction protocol
     * @param {number} txConfig.chainID The LemoChain id
     * @param {string?} txConfig.from The transaction sender address
     * @param {number|string?} txConfig.amount Unit is mo
     * @param {number|string?} txConfig.gasPrice Gas price for smart contract. Unit is mo/gas
     * @param {number|string?} txConfig.gasLimit Max gas limit for smart contract. Unit is gas
     * @param {number|string?} txConfig.expirationTime Default value is half hour from now
     * @param {string?} txConfig.message Extra value data
     * @param {Array?} txConfig.sigs Signature data list
     * @param {object} candidateInfo Candidate information
     * @param {boolean?} candidateInfo.isCandidate Set this account to be or not to be a candidate
     * @param {string} candidateInfo.name The name of node server
     * @param {string} candidateInfo.teamName The name node maintenance team
     * @param {string} candidateInfo.incomeAddress The address of miner account who receive miner benefit
     * @param {string} candidateInfo.nodeID The public key of the keypair which used to sign block
     * @param {string} candidateInfo.host Ip or domain of the candidate node server
     * @param {string} candidateInfo.port The port number of the candidate node server
     * @param {number|string} candidateInfo.introduction introduction information
     * @param {string} candidateInfo.email support email
     */
    constructor(txConfig, candidateInfo) {
        verifyCandidateInfo(candidateInfo)
        const newCandidateInfo = {
            ...candidateInfo,
            isCandidate: typeof candidateInfo.isCandidate === 'undefined' ? 'true' : String(candidateInfo.isCandidate),
            name: candidateInfo.name,
            teamName: candidateInfo.teamName,
            incomeAddress: candidateInfo.incomeAddress,
            nodeID: candidateInfo.nodeID,
            host: candidateInfo.host,
            port: String(candidateInfo.port),
            introduction: candidateInfo.introduction,
            email: candidateInfo.email,
        }

        const newTxConfig = {
            ...txConfig,
            type: TxType.CANDIDATE,
            data: newCandidateInfo,
        }
        delete newTxConfig.to
        delete newTxConfig.toName
        super(newTxConfig)
    }
}
