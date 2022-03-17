let errors = []

/**
 * Fee Configuration Spec (FCS)
 */

const fcsConfig = (feeConfiguration) => {
  const validEntity = ['CREDIT-CARD', 'DEBIT-CARD', 'BANK-ACCOUNT', 'USSD', 'WALLET-ID', '*']
  const validLocale = ['LOCL', 'INTL', '*']

  feeConfiguration.forEach((feeConfig) => {
    let id = feeConfig.match(/^[A-Z0-9]{8}/)?.at(0)
    let currency = feeConfig.match(/((?<=\d )\*)|( [A-Z]{3} )/)?.at(0)
    if (currency !== ' NGN ') {
      errors.push(`${currency} is not accepted!`)
    }
    let locale = feeConfig
      .match(/ (LOCL|INTL|(\*)) /)
      ?.at(0)
      ?.split(' ')[1]
    if (!validLocale.includes(locale)) {
      errors.push(`FEE-LOCALE is not valid!`)
    }
    let entity = feeConfig.match(/(([-]?[A-Z])+|\*)(?=\()/)?.at(0)
    if (!validEntity.includes(entity)) {
      errors.push(`${entity} is not valid!`)
    }
    let entityProperty = feeConfig.match(/\((.*?)\)/)?.at(1)
    let type = feeConfig.match(/(FLAT[\_]?|PERC)+/)?.at(0)
    let value = feeConfig.match(/([0-9]\:?\.?)*$/)?.at(0)
    if (value.includes(':')) {
      const fv = value.split(':')
      if (fv[0] > 0 && fv[1] > 0) {
      } else {
        errors.push(`${value} is not valid fee`)
      }
    } else if (value > 0) {
    } else {
      errors.push(`${value} is not valid fee`)
    }
    // const fee = { id, currency, locale, entity, entityProperty, type, value }
  })
}

const error = () => {
  return errors
}

module.exports = { fcsConfig, error }
