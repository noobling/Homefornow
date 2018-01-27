const nodemailer = require('nodemailer');
const Nexmo = require('nexmo');

/**
 * SMS initialisation
 */
const nexmo = new Nexmo({
  apiKey: 'ce6c3e3f',
  apiSecret: 'cd30f98332bf88e7',
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
    'NEXMO', number, message, { type: 'unicode' }, // NEXMO must be changed to virtual number when in production
    (err, responseData) => {
      if (err) {
        console.log(err);
        res.status(503);
        res.json({ message: err });
      } else {
        console.dir(responseData);
        // Get data from response
        // const data = {
        //   id: responseData.messages[0]['message-id'],
        //   number: responseData.messages[0].to,
        // };

        // // Emit to the client
        // io.emit('smsStatus', data);
        res.status(201);
        res.json({ message: `Sent text to ${number}` });
      }
    }
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
    res.json({ message: `Sent email to ${req.body.email}` });
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
module.exports.notification = (req, res) => {
  const { email, subject, message, number } = req.body;

  sendEmail(email, subject, message, res);

  sendSMS(number, message, res);
};
