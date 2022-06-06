require('dotenv').config();

module.exports = provisionNumbers;

async function provisionNumbers(req, res) {
  const client = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
  // Find and then purchase a phone number
  client
    .availablePhoneNumbers('US')
    .local.list({
      smsEnabled: true,
    })
    .then(async data => {
      const number = data[0]
      return await client.incomingPhoneNumbers.create({
        phoneNumber: number.phoneNumber,
        voiceMethod: 'POST',
        voiceUrl: process.env.BASE_URL+'session'
      })
    })
}



