/* eslint-disable quotes */
const nodemailer = require('nodemailer');

const carrierMap = {
  att: '@txt.att.net',
  boost: '@sms.myboostmobile.com',
  cricket: '@mms.cricketwireless.net',
  google: '@msg.fi.google.com',
  tmobile: '@tmomail.net',
  uscellular: '@email.uscc.net',
  verizon: '@vtext.com'
};


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ExtraTPhoneHome123@gmail.com',
    pass: `${process.env.REALO_PASSWORD}`
  }
});

const sendText = (user, message) => {

  const phoneEmail = `${user.phoneNumber}${carrierMap[user.carrier]}`;
  
  const mailOptions = {
    from: 'ExtraTPhoneHome123@gmail.com',
    to: phoneEmail,
    subject: 'Realo',
    text: message
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendText
};

