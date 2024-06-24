const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));


function sendEmail({ user_email, user_name, amount, refund_date }) {
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
              /* Inline CSS styles */
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
                background-color: #007bff;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
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
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h2>Thông báo hoàn tiền</h2>
              </div>
              <div class="email-content">
                <p>Xin chào, ${user_name}</p>
                <p>Chúng tôi xin thông báo rằng yêu cầu hoàn tiền của bạn đã được xử lý thành công.</p>
                <p><strong>Số tiền hoàn:</strong> ${amount}</p>
                <p><strong>Ngày hoàn:</strong> ${refund_date}</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                <p>Best wishes,<br>Pet Health Care team</p>
              </div>
              <div class="email-footer">
                <p>&copy; 2024 Pet Health Care. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occurred: ${error.message}` });
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.post("/send-email", (req, res) => {
  const { user_email, user_name, amount, refund_date } = req.body;
  console.log("Received data:", req.body);

  if (!user_email) {
    return res.status(400).send("Error: Missing user_email");
  }

  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});


app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});