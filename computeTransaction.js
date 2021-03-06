const express = require('express')
require('dotenv/config')

const app = express()
app.use(express.json())

const { getFCS, error } = require('./getValidTransactionConfig')

const computeTransactionPayload = async (req, res) => {
  const transactionPayload = req.body

  const { CurrencyCountry, Currency } = req.body

  if (Currency !== 'NGN' || CurrencyCountry !== 'NG') {
    res.status(400).send({
      Error: `No fee configuration for ${Currency} transactions.`,
    })
  } else {
    const computed = await getFCS(transactionPayload)
    console.log(computed)
    // check to make sure the FCS data is valid
    if (error().length > 0) {
      res.status(400).send({
        error: error(),
      })
    } else {
      res.status(200).send(computed)
    }

    // reset the errors array to avoid duplication
    error().length = 0
  }
}

module.exports = computeTransactionPayload
