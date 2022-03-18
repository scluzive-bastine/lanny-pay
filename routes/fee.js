const express = require('express')
const Fee = require('../models/Fee')
const router = express.Router()
const { fcsConfig, error } = require('../feeConfig')

router.post('/', (req, res) => {
  const feeData = req.body.FeeConfigurationSpec
  const feeConfiguration = feeData.split('\n')
  const saveConfigData = fcsConfig(feeConfiguration)

  console.log(error())

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
})

module.exports = router
