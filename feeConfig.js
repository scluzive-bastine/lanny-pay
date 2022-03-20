const express = require('express')

let errors = []

const redis = require('redis')

let REDIS_PORT = process.env.REDIS_PORT || 6379
let client

const REDIS_CONFIG = process.env.REDIS_URL
if (REDIS_CONFIG) {
  client = redis.createClient({ url: process.env.REDIS_URL })
} else {
  client = redis.createClient(REDIS_PORT)
}

const connectRedis = async () => {
  await client.connect()
}
connectRedis()

/**
 * Fee Configuration Spec (FCS)
 */

const fcsConfig = (payload) => {
  const feeConfiguration = payload
  const validEntity = ['CREDIT-CARD', 'DEBIT-CARD', 'BANK-ACCOUNT', 'USSD', 'WALLET-ID', '*']
  const validLocale = ['LOCL', 'INTL', '*']
  const feeTypeEntity = ['FLAT', 'PERC', 'FLAT_PERC']

  let FeeCurrency = []
  let FeeLocale = []
  let FeeEntity = []
  let EntityProperty = []

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
    FeeCurrency.push(currency)
    FeeLocale.push(locale)
    FeeEntity.push(entity)
    EntityProperty.push(entityProperty)
  })

  return [FeeCurrency, FeeLocale, FeeEntity, EntityProperty]
}

const error = () => {
  return errors
}

module.exports = { fcsConfig, error }
