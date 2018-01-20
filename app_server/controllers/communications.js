const nodemailer = require('nodemailer');
const Nexmo = require('nexmo');

// SMS initialisation
const nexmo = new Nexmo({
  apiKey: 'ce6c3e3f',
  apiSecret: 'cd30f98332bf88e7',
}, { debug: true });

// Email initialisation
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


/* POST custom email */
module.exports.email = (req, res) => {
  const emailTo = req.body.email;
  const sub = req.body.subject;
  const msg = req.body.message;
  // setup email data with unicode symbols
  const mailOptions = {
    from: 'cfcxanglicare@gmail.com', // sender address
    to: emailTo, // list of receivers separated by comma
    subject: sub, // Subject line
    text: msg, // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info);

    res.redirect('/');
  });
};

/* POST custom SMS */
module.exports.sms = (req, res) => {
  // res.send(req.body);
  // console.log(req.body);
  const number = req.body.number;
  const text = req.body.message;

  nexmo.message.sendSms(
    'NEXMO', number, text, { type: 'unicode' }, // NEXMO must be changed to virtual number when in production
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        // Get data from response
        // const data = {
        //   id: responseData.messages[0]['message-id'],
        //   number: responseData.messages[0].to,
        // };

        // // Emit to the client
        // io.emit('smsStatus', data);
        res.redirect('/');
      }
    }
  );
};

module.exports.notification = (req, res) => {
// EMAIL NOTIFICATION
  const emailTo = req.body.email; // TODO: get the email of service
  const sub = req.body.subject; // TODO: get UI guys to write up a suitable subject
  const msg = req.body.message;// TODO: get UI guys to write up a suitable message body
  // setup email data with unicode symbols
  const mailOptions = {
    from: 'cfcxanglicare@gmail.com', // sender address
    to: emailTo,
    subject: sub,
    text: msg,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log(info);
  });

  // SMS NOTIFICATION
  const number = req.body.number;
  const text = req.body.message;

  nexmo.message.sendSms(
    'NEXMO', number, text, { type: 'unicode' }, // NEXMO must be changed to virtual number when in production
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        res.redirect('/');
      }
    }
  );
};
