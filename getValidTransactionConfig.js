const redis = require('redis')

let REDIS_PORT = process.env.REDIS_PORT || 6379
let client

const REDIS_CONFIG = process.env.REDIS_URL
if (REDIS_CONFIG) {
  client = redis.createClient({ url: REDIS_CONFIG })
} else {
  client = redis.createClient(REDIS_PORT)
}
let errors = []

let data

const connectRedisClient = async (FCSData, FCSCompleteData) => {
  await FCSData
  await client.PING().then(
    async () => {
      saveFCSData(FCSData, FCSCompleteData)
    },
    async () => {
      client.on('error', (err) => console.log('Redis Client Error', err))
      await client.connect()
      saveFCSData(FCSData, FCSCompleteData)
    }
  )
}

const saveFCSData = async (FCSData, FCSCompleteData) => {
  await client.SET('currency', FCSData[0])
  await client.SET('locale', FCSData[1])
  await client.SET('entity', FCSData[2])
  await client.SET('entityProperty', FCSData[3])
  await client.SET('fcsCompleteData', FCSCompleteData)
}

const getFCS = async (transactionPayload) => {
  let FCS = ''

  await client.PING().then(
    async () => {
      FCS = await feeComputation(transactionPayload)
    },
    async () => {
      client.on('error', (err) => console.log('Redis Client Error', err))
      client = redis.createClient(REDIS_PORT)
      await client.connect()
      FCS = await feeComputation(transactionPayload)
    }
  )

  return FCS
}

const getFullFCS = async () => {
  let fullData = await client.get('fcsCompleteData')
  fullData = fullData.split(',')
  return fullData
}

const feeComputation = async (transactionPayload) => {
  const { Customer, CurrencyCountry, PaymentEntity, Amount } = transactionPayload
  let payloadEntityProperty = Object.values(PaymentEntity).splice(0, 5)
  /**
        checking which FEE-ENTITY matches the
        PaymentEntity from the Payload
    */
  let feeEntityIndex = []
  let feeEntity = await client.get('entity')
  feeEntity = feeEntity.split(',')

  feeEntity.forEach((item, index) => {
    if (item.entity === PaymentEntity.Type || item === '*') {
      console.log('entity item index: ', item, index)
      feeEntityIndex.push(index)
    }
  })

  /**
   * checking which ENTITY-PROPERTY
   * matches PaymentEntity from the Payload
   */
  let entityPropertyIndex = []

  let entityProperty = await client.get('entityProperty')
  entityProperty = entityProperty.split(',')

  entityProperty.forEach((item, index) => {
    if (payloadEntityProperty.includes(item.entityProperty) || item === '*') {
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
      if (feeEntity[sameIndex[i]] === PaymentEntity.Type) {
        feeEntityFCS.push(sameIndex[i])
      }
      if (payloadEntityProperty.includes(entityProperty[sameIndex[i]])) {
        entityPropertyFCS.push(sameIndex[i])
      }
    }
  } else if (sameIndex.length === 1) {
    feeEntityFCS.push(sameIndex.toString())
    entityPropertyFCS.push(sameIndex.toString())
  } else {
    errors.push('No Fee Configuration Spec. found')
  }

  let fcs = await getFullFCS()
  let fcsValidData = ''
  console.log('fcs; ', fcs)

  if (feeEntityFCS.length > 0) {
    fcsValidData = fcs[feeEntityFCS]
  } else {
    fcsValidData = fcs[entityPropertyFCS]
  }

  let AppliedFeeValue = ''
  let ChargeAmount = ''
  let SettlementAmount = ''
  let appliedFeeID = fcsValidData.split(' ')[0]
  let feeType = fcsValidData.split(' ')[6]
  let feeValue = fcsValidData.split(' ')[7]

  switch (feeType) {
    case 'FLAT':
      AppliedFeeValue = feeValue
      break
    case 'PERC':
      AppliedFeeValue = (feeValue * Number(Amount)) / 100
      break
    case 'FLAT_PERC':
      let flatPercFee = feeValue
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
    AppliedFeeID: appliedFeeID,
    AppliedFeeValue: AppliedFeeValue,
    ChargeAmount: ChargeAmount,
    SettlementAmount: SettlementAmount,
  }

  return calculatedFee
}

const error = () => {
  return errors
}

module.exports = { feeComputation, connectRedisClient, saveFCSData, getFCS, error }
