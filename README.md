# lanny-pay

Lannister Pay API
Introduction
Lannister Pay API is a HTTP REST API built for Lannister Pay, a Payment processing platform.

Overview
What you can do with this API:

#Set up Fees Configuration
send configuration details to /fees

#Compute fees for transactions
send transaction payload to /compute-transaction-fee


Set Up Development
Check that nodejs is installed:
  node --version
  >> v12.22.1 or greater
Clone the lannister pay repo and cd into it:
  git clone https://github.com/scluzive-bastine/lanny-pay
  cd lanny-pay
Install dependencies:
  npm install

Run the application with the command:
  npm start
