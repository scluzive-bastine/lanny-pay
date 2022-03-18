require('dotenv/config')
const Fee = require('./models/Fee')
let errors = []

let data
const feeComputation = async (payload) => {
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
  console.log('feeEntity: ', feeEntityItem)

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

  console.log('entityProperty: ', entityProperty)

  console.log('feeEntityIndex: ', feeEntityIndex)
  console.log('entityPropertyIndex: ', entityPropertyIndex)

  /**
   * Checking to see which array index match
   */
  const sameIndex = entityPropertyIndex.filter((n) => feeEntityIndex.includes(n))
  console.log('same index: ', sameIndex)

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
  console.log('feeEntityFCS: ', feeEntityFCS)
  console.log('entityPropertyFCS: ', entityPropertyFCS)

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
      console.log(flat, perc)
      AppliedFeeValue = Number(flat) + (Number(Amount) * Number(perc)) / 100
      console.log('AppliedFeeValue: ', AppliedFeeValue)
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
}

module.exports = { feeComputation }
