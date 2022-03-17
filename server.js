const PORT = 1000
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { fcsConfig, error } = require('./feeConfig')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/fee', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`APP IS RUNNUNG ON: ${PORT}`)
})
