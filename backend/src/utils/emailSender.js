const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP server
  port: 587,               // Common port for non-secure SMTP
  secure: false,           // Use true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // Replace with your email
    pass: 'your-email-password',    // Replace with your email password
  },
});

// Send an email
exports.sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: '"Optivista" <no-reply@example.com>', // Sender address
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};
