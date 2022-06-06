
require('dotenv').config();

module.exports = releaseNumbers;

async function releaseNumbers(req, res) {
  const client = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_AUTHTOKEN);
 
  // https://www.twilio.com/docs/phone-numbers/api/incomingphonenumber-resource
  // client.incomingPhoneNumbers
  //   .each({
  //     phoneNumber: `+1${args.phone_number}`
  //   }, (incomingPhoneNumbers) => {
  //     client.incomingPhoneNumbers(incomingPhoneNumbers.sid)
  //       .remove()
  //       .then(() => incomingPhoneNumbers.sid)
  //       .done()
  //   }
  //   )
  
}
