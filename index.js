const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')
const PORT = 1000

const { fcsConfig, error } = require('./feeConfig')
const computeTransactionPayload = require('./computeTransaction')

const app = express()
app.use(bodyParser.json())

app.post('/fees', fcsConfig)

app.post('/compute-transaction-fee', computeTransactionPayload)
// connect DB
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log('Conneted to DB')
})

app.listen(PORT, () => {
  console.log(`APP IS RUNNUNG ON: ${PORT}`)
})
