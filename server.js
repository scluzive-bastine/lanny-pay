const PORT = 1000
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')
const app = express()
const { feeComputation, computeTransactionFee } = require('./computeTransaction')

const feeRoute = require('./routes/fee')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/fee', feeRoute)

app.post('/compute-transaction-fee', (req, res) => {
  const payload = req.body
  const { Customer, CurrencyCountry, PaymentEntity, Amount } = payload
  const data = feeComputation(payload)
  res.send(data)
})
// app.post('/compute-transaction-fee', feeComputation)

// connect DB
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log('Conneted to DB')
})

app.listen(PORT, () => {
  console.log(`APP IS RUNNUNG ON: ${PORT}`)
})
