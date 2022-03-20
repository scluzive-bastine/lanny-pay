const express = require('express')
const bodyParser = require('body-parser')
require('dotenv/config')
const PORT = process.env.PORT || 4000

const computeTransactionPayload = require('./computeTransaction')
const { connectRedisClient } = require('./getValidTransactionConfig')
const fees = require('./fees')

const app = express()
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('lannister pay')
})

app.post('/fees', fees, connectRedisClient)

app.post('/compute-transaction-fee', computeTransactionPayload)

app.listen(PORT, () => {
  console.log(`APP IS RUNNUNG ON: ${PORT}`)
})
