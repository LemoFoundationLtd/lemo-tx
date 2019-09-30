export default {
    InvalidAddress: address => `Invalid LemoChain address ${address}`,
    InvalidAddressConflict: address => `Private key is not match with the payer address ${address}`,
    InvalidAddressLength: address => `Invalid length of LemoChain address ${address}`,
    InvalidAddressCheckSum: address => `Invalid address checksum ${address}`,

    TXFieldToLong: (fieldName, length) => `The field ${fieldName} must less than ${length} bytes`,
    TXMustBeNumber: (key, value) => `'${key}' ${value} should be a number or hex`,
    TXInvalidChainID: () => '\'chainID\' should not be empty',
    TXInvalidType: (key, value, types) => {
        // Get class name if any type is class
        types = types.map(item => item.name || item)
        const typePhrase = types.length === 1 ? types[0] : `one of [${types}]`
        return `The type of '${key}' should be '${typePhrase}', rather than '${typeof value}'`
    },
    TXCanNotTestRange: (key, value) => `The type of '${key}' ${value} is invalid: ${typeof value}`,
    TXInvalidRange: (key, value, from, to) => `'${key}' ${value} is not in range [0x${from.toString(16)}, 0x${to.toString(16)}]`,
    TXInvalidLength: (key, value, length) => `The length of '${key}' ${value} should be ${length}, not ${value.length}]`,
    TXInvalidMaxLength: (key, value, length) => `The length of '${key}' ${value} should be less than ${length}, but now it is ${value.length}]`,
    TXInvalidMaxBytes: (key, value, length, currentLength) => `The length of '${key}' ${value} should be less than ${length} bytes, but now it is ${currentLength}]`,
    FieldIsRequired: (value) => `The ${value} is required`,
    InvalidParams: (value) => `No valid parameter is detected from ${value}`,
    TXParamMissingError: param => `The ${param} in transaction can not be missing`,
    TXIsNotDecimalError: param => `The ${param} in transaction should be a decimal number`,
    TXNegativeError: param => `The ${param} in transaction should be positive`,
    TXInfoError: () => 'Edit information cannot be empty',
    TxInvalidSymbol: parm => `Wrong character, '${parm}' must be true or false`,
    MoneyFormatError: () => 'The value entered is in the wrong format',
    NotSupportedType: () => 'The type of input value is not supported',
    TXInvalidUserIdLength: () => 'The length of the userId cannot be more than 10',
    InvalidBoxTransaction: () => 'This is an incorrect transaction information or contains box transaction',
    InvalidDeepLink: uri => `Invalid LemoChain deep link ${uri}`,
    InvalidDeepLinkType: type => `The LemoChain deep link type ${type} is unknown`,
    InvalidSignDeepLink: () => 'Invalid LemoChain sign deep link, message or data is required',
    InvalidToName: () => 'Invalid toName',
}
