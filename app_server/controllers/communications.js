const nodemailer = require('nodemailer');
const Nexmo = require('nexmo');

/**
 * SMS initialisation
 */
const nexmo = new Nexmo({
  apiKey: process.env.nexmo_api,
  apiSecret: process.env.nexmo_secret,
}, { debug: true });

/**
 * Email initialisation
 */
const transporter = nodemailer.createTransport({
  /* {host: 'smtp.gmail.com', // Anglicare email SMTP host (placeholder for now)
  port: 587,
  secure: false, // true for 465, false for other ports */
  service: 'gmail',
  auth: {
    user: 'cfcxanglicare@gmail.com', // Anglicare email ID (placeholder for now) **Need to make it .env for actual email
    pass: 'GyRCGrabvkrC3Nfz', // Anglicare email ID (placeholder for now) **Need to make it .env for actual email
  },
  // remove when deployed, only for testing
  tls: {
    rejectUnautorized: false,
  },

});

/**
 * Send an SMS to the given number
 *
 * @param {*} number
 * @param {*} message
 * @param {*} res
 */
function sendSMS(number, message, res) {
  nexmo.message.sendSms(
    process.env.nexmo_number, number, message, { type: 'unicode' }, // 'NEXMO' must be changed to virtual number when in production
    (err, responseData) => {
      if (err) {
        console.log(err);
        return res.status(503);
        // res.json({ message: err });
      }
      console.log(responseData.messages[0].status);
      return responseData.messages[0].status;
    },
  );
}

/**
 * Send an email to the given email (to)
 *
 * @param {*} to
 * @param {*} subject
 * @param {*} text
 * @param {*} res
 */
function sendEmail(to, subject, text, res) {
  // setup email data with unicode symbols
  const mailOptions = {
    from: 'cfcxanglicare@gmail.com', // sender address
    to, // list of receivers separated by comma
    subject, // Subject line
    text, // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(503);
      res.json({ message: error });
    }
    console.log(info);
    res.status(200);
    res.json({ message: `Sent email to ${to}` });
  });
}

/**
 * Send an email with node mailer
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.email = (req, res) => {
  const { message, subject, email } = req.body;

  sendEmail(email, subject, message, res);
};

/**
 * Send an sms to given number
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.sms = (req, res) => {
  const { number, message } = req.body;

  sendSMS(number, message, res);
};

/**
 * Sends an email and text notification with the given message
 *
 * @param {*} req
 * @param {*} res
 */
module.exports.notification = (number, email, message, subject, res) => {
  if (email !== undefined) {
    sendEmail(email, subject, message, res);
  }

  if (number !== undefined) {
    sendSMS(number, message, res);
  }
};
