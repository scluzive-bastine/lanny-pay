const express = require('express')
require('dotenv/config')
const Fee = require('./models/Fee')
let errors = []

let data
const feeComputation = async (payload) => {
  // const payload = req.body
  const { Customer, CurrencyCountry, PaymentEntity, Amount } = payload
  let payloadEntityProperty = Object.values(PaymentEntity).splice(0, 5)

  const getFCS = async () => {
    let FCS = await Fee.find()
    return FCS
  }

  /**
        checking which FEE-ENTITY matches the
        PaymentEntity from the Payload
    */
  let feeEntityIndex = []
  let feeEntityItem = []
  let feeEntity = await Fee.find({}).select('entity -_id').lean()
  feeEntity.forEach((item, index) => {
    feeEntityItem.push(item.entity)
    if (item.entity === PaymentEntity.Type || item.entity === '*') {
      feeEntityIndex.push(index)
    }
  })

  /**
   * checking which ENTITY-PROPERTY
   * matches PaymentEntity from the Payload
   */
  let entityPropertyIndex = []
  let entityPropertyItem = []

  let entityProperty = await Fee.find({}).select('entityProperty -_id').lean()
  entityProperty.forEach((item, index) => {
    entityProperty.push(item.entityProperty)
    if (payloadEntityProperty.includes(item.entityProperty) || item.entityProperty === '*') {
      entityPropertyIndex.push(index)
    }
  })
  /**
   * Checking to see which array index match
   */
  const sameIndex = entityPropertyIndex.filter((n) => feeEntityIndex.includes(n))

  let feeEntityFCS = []
  let entityPropertyFCS = []

  /**
   * checking for specificity
   */
  if (sameIndex.length > 1) {
    for (i = 0; i <= sameIndex.length; i++) {
      if (feeEntityItem[sameIndex[i]] === PaymentEntity.Type) {
        feeEntityFCS.push(sameIndex[i])
      }
      if (payloadEntityProperty.includes(entityPropertyItem[sameIndex[i]])) {
        entityPropertyFCS.push(sameIndex[i])
      }
    }
  } else if (sameIndex.length === 1) {
    feeEntityFCS.push(sameIndex.toString())
    entityPropertyFCS.push(sameIndex.toString())
  } else {
    errors.push('No Fee Configuration Spec. found')
  }

  let fcs = await getFCS()
  let fcsValidData = ''

  if (feeEntityFCS.length > 0) {
    fcsValidData = fcs[feeEntityFCS]
  }

  let AppliedFeeValue = ''
  let ChargeAmount = ''
  let SettlementAmount = ''

  switch (fcsValidData.type) {
    case 'FLAT':
      AppliedFeeValue = fcsValidData.value
      break
    case 'PERC':
      AppliedFeeValue = (fcsValidData.value * Number(Amount)) / 100
      break
    case 'FLAT_PERC':
      let flatPercFee = fcsValidData.value
      let [flat, perc] = flatPercFee.split(':')
      AppliedFeeValue = Number(flat) + (Number(Amount) * Number(perc)) / 100
    default:
      break
  }

  if (Customer.BearsFee) {
    ChargeAmount = Number(Amount) + AppliedFeeValue
  } else {
    ChargeAmount = Number(Amount)
  }
  SettlementAmount = ChargeAmount - AppliedFeeValue

  const calculatedFee = {
    AppliedFeeID: fcsValidData.id,
    AppliedFeeValue: AppliedFeeValue,
    ChargeAmount: ChargeAmount,
    SettlementAmount: SettlementAmount,
  }

  return calculatedFee
}

const error = () => {
  return errors
}

module.exports = { feeComputation, error }
