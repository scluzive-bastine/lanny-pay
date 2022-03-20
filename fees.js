const express = require('express')
const { fcsConfig, error } = require('./feeConfig')
const { connectRedisClient } = require('./getValidTransactionConfig')

const fees = async (req, res) => {
  const feeData = req.body.FeeConfigurationSpec
  const feeConfiguration = feeData.split('\n')

  const comparisonData = fcsConfig(feeConfiguration)

  connectRedisClient(comparisonData, feeConfiguration)

  // check to make sure the FCS data is valid
  if (error().length > 0) {
    res.status(400).send({
      status: 'Bad Request',
      error: 'Invalid fee configuration spec.',
      errorData: error(),
    })
  } else {
    res.status(200).send({
      status: 'ok',
    })
  }

  // reset the errors array to avoid duplication
  error().length = 0
}

module.exports = fees
