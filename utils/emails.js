const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

// Construct the file path for the email templates directory
const templatesDir = path.join(
  __dirname,
  '../utils/email-templates',
  'templates'
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USERNAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

const sendEmail = async (options) => {
  try {
    // Read the email template file based on the email type
    const templateFilePath = path.join(
      __dirname,
      'email-templates',
      `${options.template}.ejs`
    );

    const emailTemplate = fs.readFileSync(templateFilePath, 'utf8');

    // Render the email template with provided data
    const renderedEmail = ejs.render(emailTemplate, options.data);

    const mailOptions = {
      from: 'sandythabit588@gmail.com',
      to: options.email,
      subject: options.subject,
      html: renderedEmail,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
