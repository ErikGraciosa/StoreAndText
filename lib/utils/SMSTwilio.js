const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendMessage = (messageBody) => {
    client.messages
      .create({
         body: messageBody,
         from: '+18606891503',
         to: '+15038512867'
       })
      .then(message => console.log(`MessageID is: ${message.sid}`));
      console.log('text sent');
}

module.exports = {
    sendMessage
  };