exports.forgotMail = (verifyToken) => {
  return `<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 36px 24px 0;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                border-top: 3px solid #d4dadf;
              "
            >
              <h1
                style="
                  margin: 0;
                  font-size: 32px;
                  font-weight: 700;
                  letter-spacing: -1px;
                  line-height: 48px;
                "
              >
                Reset Password
              </h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="left"
              bgcolor="#ffffff"
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
              "
            >
              <p style="margin: 0">
                Tap the button below to reset password for your email address.
              </p>
            </td>
          </tr>
          <tr>
            <td align="left" >
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 12px">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td
                          align="center"
                          bgcolor="#1a82e2"
                          style="border-radius: 6px"
                        >
                          <a
                            href="${process.env.RESET_URL}/change-password/${verifyToken}"
                            target="_blank"
                            style="
                              display: inline-block;
                              padding: 16px 36px;
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              color: #ffffff;
                              text-decoration: none;
                              border-radius: 6px;
                            "
                            >Reset</a
                          >
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              align="left"
              
              style="
                padding: 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
                border-bottom: 3px solid #d4dadf;
              "
            >
              <p style="margin: 0">
                Thanks,<br />
                Nexus Booking
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 24px">
        <table
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="max-width: 600px"
        >
          <tr>
            <td
              align="center"
             
              style="
                padding: 12px 24px;
                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                font-size: 14px;
                line-height: 20px;
                color: #666;
              "
            >
              <p style="margin: 0">
                You received this email because we received a request for
                signUp for your account. If you didn't request you can safely
                delete this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

exports.template = (body) => {
  return `<!DOCTYPE html>
  <html
    lang="en"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="x-apple-disable-message-reformatting" />
      <title></title>
      <style>
        table,
        td,
        div,
        h1,
        p {
          font-family: Arial, sans-serif;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0">
      <table
        role="presentation"
        style="
          width: 100%;
          border-collapse: collapse;
          border: 0;
          border-spacing: 0;
          background: #ffffff;
        "
      >
        <tr>
          <td align="center" style="padding: 0">
            <table
              role="presentation"
              style="
                width: 602px;
                border-collapse: collapse;
                border: 1px solid #cccccc;
                border-spacing: 0;
                text-align: left;
              "
            >
              <tr>
                <td
                  align="center"
                  style="padding: 40px 0 30px 0; background: #5e35b1;color: #ffffff;font-size: 18px;"
                >
                 Booking and Reservation
                </td>
              </tr>
              <tr>
              <td style="padding: 50px; width: 50%" >
                  ${body}
                  </td>
              </tr>
              <tr>
                <td style="padding: 30px; background: #5e35b1">
                  <table
                    role="presentation"
                    style="
                      width: 100%;
                      border-collapse: collapse;
                      border: 0;
                      border-spacing: 0;
                      font-size: 9px;
                      font-family: Arial, sans-serif;
                    "
                  >
                    <tr>
                      <td style="padding: 0; width: 50%" align="center">
                        <p
                          style="
                            margin: 0;
                            font-size: 14px;
                            line-height: 16px;
                            font-family: Arial, sans-serif;
                            color: #ffffff;
                          "
                        >
                          &copy; Booking and Reservation 2023<br />
                        </p>
                      </td>
                   </tr>
                    <tr>
                      <td style="padding: 0;padding-top: 20px; width: 50%" align="center">
                        <table
                          role="presentation"
                          style="
                            border-collapse: collapse;
                            border: 0;
                            border-spacing: 0;
                          "
                        >
                          <tr>
                            <td style="padding: 0 0 0 10px; width: 38px">
                              <a
                                href="http://www.twitter.com/"
                                style="color: #ffffff"
                                ><img
                                  src="https://assets.codepen.io/210284/tw_1.png"
                                  alt="Twitter"
                                  width="38"
                                  style="height: auto; display: block; border: 0"
                              /></a>
                            </td>
                            <td style="padding: 0 0 0 10px; width: 38px">
                              <a
                                href="http://www.facebook.com/"
                                style="color: #ffffff"
                                ><img
                                  src="https://assets.codepen.io/210284/fb_1.png"
                                  alt="Facebook"
                                  width="38"
                                  style="height: auto; display: block; border: 0"
                              /></a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}