const express = require('express')

const Fee = require('./models/Fee')
let updatedFee = []
let errors = []

/**
 * Fee Configuration Spec (FCS)
 */

const fcsConfig = async (req, res) => {
  const feeData = req.body.FeeConfigurationSpec
  const feeConfiguration = feeData.split('\n')
  const validEntity = ['CREDIT-CARD', 'DEBIT-CARD', 'BANK-ACCOUNT', 'USSD', 'WALLET-ID', '*']
  const validLocale = ['LOCL', 'INTL', '*']
  const feeTypeEntity = ['FLAT', 'PERC', 'FLAT_PERC']

  feeConfiguration.forEach(async (feeConfig) => {
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
    if (!entityProperty.trim().length > 0 && entityProperty !== '*') {
      errors.push(`entity property is not valid!`)
    }
    let type = feeConfig.match(/(FLAT[\_]?|PERC)+/)?.at(0)
    if (!feeTypeEntity.includes(type)) {
      errors.push(`Fee type is not valid`)
    }
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
    updatedFee.push({ id, currency, locale, entity, entityProperty, type, value })
  })

  if (error().length > 0) {
    res.status(400).send({
      status: 'Bad Request',
      error: 'Invalid fee configuration spec.',
      errorData: error(),
    })
  } else {
    // saving the configuration if there's no error
    const saved = updatedFee.forEach(async (item) => {
      const saveFeee = new Fee(item)
      await saveFeee.save()
    })
    await saved
    res.status(200).send({
      status: 'ok',
    })
  }

  error().length = 0
}

const error = () => {
  return errors
}

module.exports = { fcsConfig, error }
