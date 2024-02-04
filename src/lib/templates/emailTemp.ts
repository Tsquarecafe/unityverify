// an email template that can be used with Nodemailer to send emails

const HTML_TEMPLATE = ({ name, url }: { name: string; url: string }) => {

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>NodeMailer Email Template</title>
          <style>
            .container {
              width: 100%;
              height: 100%;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .email {
              width: 80%;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
            }
            .email-header {
              background-color: #0f172a;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #0f172a;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email">
              <div class="email-header">
                <h1>CONFIRMATION OF REGISTRATION</h1>
              </div>
              <div class="email-body">
              <h3>Hi! ${name}</h3>

               <p>We received a request to reset your password. If you didn't make this request,   <br />

               you can ignore this email. Otherwise, you can reset your password using the link below:</p>

              <br />

              <a target="_blank" href="${url}">Reset Password Link</a>

              <br />

              <p>This link will expire in 5 mins for security reasons.</p>

              <b />

              <p>If you have any issues or didn't request a password reset, please contact our support team at:</p>

              
              <p>Whatsapp: +234 803 096 1870</p>
              <p>Email: unityverifyenterprise@gmail.com</p>
             

              </div>
              <div class="email-footer">
                <p>Cheers!!</p>
              <p>UnityVerify</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
};

export default HTML_TEMPLATE;
