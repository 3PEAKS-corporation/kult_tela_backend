const { SERVER_URL, IMAGES_FOLDER } = require('../config/env')

module.exports = {
  response: {
    error: (res, error = 'Все поля должны быть заполнены!', code = 400) =>
      res.status(code).send({ success: false, error }),
    success: (res, message, code = 200) =>
      res.status(code).send({ success: true, data: message })
  },
  verify: body => {
    let isVerified = true
    body.forEach(item => {
      isVerified = isVerified && Boolean(typeof item == 'number' ? true : item)
    })
    return isVerified
  },
  getImageUrl: (image_src, prefix) => {
    const folder = prefix || IMAGES_FOLDER.substring(1)
    return image_src !== null ? SERVER_URL + folder + '/' + image_src : null
  },
  getCurrentDate: () => {
    const d = new Date()
    return `${
      d.getDate().toString().length === 1
        ? '0' + d.getDate().toString()
        : d.getDate()
    }.${
      d.getMonth().toString().length === 1
        ? '0' + (d.getMonth() + 1).toString()
        : d.getMonth()
    }.${d.getFullYear()}`
  },
  generateEmail: ({ title, body, link }) => `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">	
          <tr>
            <td style="padding: 10px 0 30px 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
                <tr>
                  <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #1d1d22; font-family: Arial, sans-serif; font-size: 24px;">
                          <b>${title}</b>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px 0 30px 0; color:  #1d1d22; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">${body}<br><a href="${link.url}" style="font-family: Arial, sans-serif; line-height: 22px; font-size: 18px;">${link.text}</a>
      </td>
                      </tr>
                    
                    </table>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#1d1d22" style="padding: 30px 30px 30px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
                          &reg; Культ Тела, 2020<br/>
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
      </html>`
}
