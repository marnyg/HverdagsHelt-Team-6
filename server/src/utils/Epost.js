// @flow

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = {
  send_email: async function(recipient: String, subject: String, body: String) {
      const mailOptions = {
        from: 'hverdagshelt.team6@gmail.com',
        to: recipient,
        subject: subject,
        text: body
      };
      try{
        let info = await transporter.sendMail(mailOptions);
        console.log(info);
        return true
      }
      catch (err) {
        console.log(err);
        return false
      }
  }
};