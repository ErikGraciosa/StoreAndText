const accountSid = "AC9e28e1f9cf59136a3f61ad3f6d12de6b"; //process.env.TWILIO_ACCOUNT_SID;
console.log(accountSid);
const authToken = "6b05b6933b3bcff20f0b491f15a71ba3"; //process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const sendMessage = (messageBody) => {
    client.messages
      .create({
         body: messageBody,
         from: '+18606891503',
         to: '+15038512867'
       })
      .then(message => console.log(message.sid));
}