const mailer = require('nodemailer');

const transporter = mailer.createTransport({
  host: 'mail.spsl.nsc.ru',
  port: 25,
});

module.exports = function(data, template) {
  return new Promise((resolve, reject) => {
    const mailConfig = {
      from: { name: 'Elepov info', address: 'info@elepov.gpntbsib.ru' },
      to: data.email,
      subject: data.subject,
      text: data.text,
      html: template ? template : `<p>${data.text}</p>`,
      attachments: data.attachments,
      list: {
        unsubscribe: {
          url: `http://localhost:3000/api/auth/unsubscribe/${data.email}`,
          comment: 'Отписаться от рассылки'
      }
    }
    };

    transporter.sendMail(mailConfig, function(err, info) {
      if(err) reject(err);
      if(info) {
        if(info.rejected.length > 0) {
          reject('bad email');
        } else {
          resolve(info.messageId);
        }
      }
    });
  });
};
