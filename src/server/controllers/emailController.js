const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');


const sendEmail = ({ user_email, user_name, amount, refund_date, request_date }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aqaq03122003@gmail.com",
        pass: "lnaxqylhuaztmnwn",
      },
    });

    const mail_configs = {
      from: "aqaq03122003@gmail.com",
      to: user_email,
      subject: "Thông báo hoàn tiền",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            text-align: center;
            padding: 20px;
            border-bottom: 1px solid #ddd;
          }
          .email-header .contact-info {
            font-size: 14px;
            color: #333;
            cursor: pointer;
          }
          .email-header .contact-info a {
            color: #007bff;
            text-decoration: none;
          }
          .email-header .contact-info a:hover {
            text-decoration: underline;
          }
          .email-header .logo {
            margin-top: 20px;
          }
          .email-header .logo a {
            font-size: 24px;
            text-decoration: none;
            color: #007bff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .email-header .logo a:hover {
            text-decoration: underline;
          }
          .email-title {
            text-align: center;
            padding: 20px;
            font-size: 24px;
            color: #007bff;
          }
          .email-content {
            padding: 20px;
            color: #333333;
          }
          .email-content p {
            margin-bottom: 15px;
            line-height: 1.6;
          }
          .email-content p:last-child {
            margin-bottom: 0;
          }
          .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #ddd;
          }
          .email-footer .social-icons a {
            margin: 0 30px;
            text-decoration: none;
            color: #007bff;
            font-size: 18px;
          }
          .fb {
            width: 45px!important;
            height: 45px!important;
            margin-bottom: 6px;
            margin-right: 12px;
          }
          .email-footer .social-icons img {
            width: 60px;
            height: 60px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <div class="logo">
              <a href="#home"> Pet Care Center</a>
            </div>
            <div class="contact-info">
              <p><a href="tel:1900xxx">1900 xxx xxx xxx</a> | <a href="https://mypetcare-center.vercel.app">mypetcare-center.vercel.app</a></p>
            </div>
          </div>
          <div class="email-title">
            <h2>Refund Announcement</h2>
          </div>
          <div class="email-content">
            <p>Hello, ${user_name}</p>
            <p>We are happy to notify you that your request for a refund has been processed successfully.</p>
            <p><strong>Refund Amount:</strong> ${amount}</p>
            <p><strong>Request Day:</strong> ${request_date}</p>
            <p><strong>Refund Day:</strong> ${ refund_date}</p>
            <p>Thank you for using our services.</p>
            <p>Best wishes,<br>Pet Health Care team</p>
          </div>
          <div class="email-footer">
            <p>&copy; 2024 Pet Health Care. All rights reserved.</p>
            <p>Any question please contact</p>
            <div class="social-icons">
              <a href="https://www.facebook.com/baodeptry03"><img class="fb"  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-DPoaXPIw9n83GUBxdDD4OlY1yTF1DGcbbQ&s" alt="Facebook"></a>
              <a href="https://m.me/baodeptry03"><img src="https://static.vecteezy.com/system/resources/previews/012/660/850/non_2x/messenger-logo-on-transparent-isolated-background-free-vector.jpg" alt="Messenger"></a>
              <a href="https://t.me/dbao0312"><img src="https://static.vecteezy.com/system/resources/previews/012/660/859/original/telegram-logo-on-transparent-isolated-background-free-vector.jpg" alt="Telegram"></a>
            </div>
          </div>
        </div>
      </body>
    </html>`
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred: ${error.message}` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
};

const sendCancellationEmail = ({ user_email, user_name, booking_id, cancel_date }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aqaq03122003@gmail.com",
        pass: "lnaxqylhuaztmnwn",
      },
    });

    const mail_configs = {
      from: "aqaq03122003@gmail.com",
      to: user_email,
      subject: "Booking Cancellation Notice",
      html: `
      <html>
        <body>
          <div>
            <h2>Booking Cancellation Notice</h2>
            <p>Hello, ${user_name}</p>
            <p>We regret to inform you that your booking with ID ${booking_id} has been cancelled.</p>
            <p><strong>Cancellation Date:</strong> ${cancel_date}</p>
            <p>We apologize for any inconvenience this may cause.</p>
            <p>Best regards,<br>Pet Health Care team</p>
          </div>
        </body>
      </html>`
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error occurred: ${error.message}` });
      }
      return resolve({ message: "Cancellation email sent successfully" });
    });
  });

};

const sendUpdatePasswordEmail = async ({ user_email }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aqaq03122003@gmail.com',
        pass: 'lnaxqylhuaztmnwn',
      },
    });

    const token = uuidv4();
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    const resetRequest = {
      email: user_email,
      token: token,
      expires: Date.now() + 3600000, // 1 hour expiration
    };

    admin.database().ref('passwordResetTokens').push(resetRequest)
      .then(() => {
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                  }
                  .email-container {
                      background-color: #ffffff;
                      margin: 50px auto;
                      padding: 20px;
                      max-width: 600px;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  .email-header {
                      text-align: center;
                      padding: 20px 0;
                  }
                  .email-header img {
                      max-width: 100px;
                  }
                  .email-header a {
                      text-decoration: none;
                      font-size: 24px;
                      color: #333333;
                  }
                  .email-body {
                      padding: 20px;
                  }
                  .email-body h1 {
                      font-size: 24px;
                      color: #333333;
                  }
                  .email-body p {
                      font-size: 16px;
                      color: #666666;
                      line-height: 1.5;
                  }
                  .email-body a.button {
                      display: inline-block;
                      margin-top: 40px;
                      padding: 10px 20px;
                      color: #ffffff;
                      background-color: #e91e63;
                      text-decoration: none;
                      border-radius: 5px;
                  }
                  .email-footer {
                      padding: 20px;
                      font-size: 12px;
                      color: #999999;
                      text-align: center;
                      border-top: 1px solid #dddddd;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="email-header">
                      <a href="#">Pet Care Center</a>
                  </div>
                  <div class="email-body">
                      <h1>Reset Your Password</h1>
                      <p>Need to reset your password? No problem! Just click the button below and you'll be on the way.</p>
                      <p>If you did not make this request, please ignore this email.</p>
                                 <table align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <a href="${resetLink}" class="button">Reset your password</a>
                    </td>
                </tr>
            </table>
                  </div>
                  <div class="email-footer">
                      <p>If you are having trouble clicking the password reset button, copy and paste the URL below into your web browser:</p>
                      <p><a href="${resetLink}">${resetLink}</a></p>
                  </div>
              </div>
          </body>
          </html>
        `;

        const mail_configs = {
          from: 'aqaq03122003@gmail.com',
          to: user_email,
          subject: 'Password Reset Request',
          html: htmlContent
        };

        transporter.sendMail(mail_configs, function (error, info) {
          if (error) {
            console.log(error);
            return reject({ message: `An error occurred: ${error.message}` });
          }
          return resolve({ message: 'Password reset email sent successfully' });
        });
      })
      .catch(error => reject({ message: `Failed to save reset token: ${error.message}` }));
  });
};

exports.sendUpdatePasswordEmail = (req, res) => {
  const { user_email } = req.body;
  if (!user_email) {
    return res.status(400).send('Error: Missing user_email');
  }

  sendUpdatePasswordEmail(req.body)
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message));
};

exports.sendEmailHandler = (req, res) => {
  const { user_email, user_name, amount, refund_date, request_date } = req.body;
  console.log("Received data:", req.body);

  if (!user_email) {
    return res.status(400).send("Error: Missing user_email");
  }

  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
};

exports.sendCancellationEmailHandler = (req, res) => {
  const { user_email, user_name, booking_id, cancel_date } = req.body;
  console.log("Received data:", req.body);

  if (!user_email) {
    return res.status(400).send("Error: Missing user_email");
  }

  sendCancellationEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
};
