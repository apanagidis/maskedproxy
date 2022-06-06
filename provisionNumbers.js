// Twilio buy/release https://github.com/MoveOnOrg/switchboard-twilio/tree/main/utils

const accountSid = "AC4d6eb4e274d6f1ee0399424f170f5c50";
const authToken = "8af13e0032e965bdac290d3d175237c5";
const client = require('twilio')(accountSid, authToken);

// require('dotenv').config()

const friendlyName = process.env.FRIENDLY_NAME

  // Find and then purchase a phone number
  client
    .availablePhoneNumbers('US')
    .local.list({
      smsEnabled: true,
    })
    .then(data => {
      const number = data[0]
      return client.incomingPhoneNumbers.create({
        friendlyName: friendlyName,
        phoneNumber: number.phoneNumber,
        voiceMethod: 'POST',
        voiceUrl: 'https://42df-202-133-218-184.ngrok.io/voice'
      })
    })
