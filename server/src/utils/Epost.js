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
  /**
   * Send one email
   * @param recipient
   * @param subject
   * @param body
   * @returns {Promise<boolean>}
   */
  send_email: async function(recipient: string, subject: string, body: string) {
    const mailOptions = {
      from: 'hverdagshelt.team6@gmail.com',
      to: recipient,
      subject: subject,
      text: body
    };
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log(info);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  /**
   * Sends email to multiple subscribers
   * @param recipients
   * @param subject
   * @param body
   * @returns {Promise<JSON[]>}
   */
  send_subs_email: async function(recipients: Array<string>, subject: string, body: string) {
    let emails_sent = await recipients.map(async rec => {
      await module.exports.send_email(rec, subject, body);
    });
    return Promise.all(emails_sent);
  }
};
