const { email: sendEmail } = require('../../../services/')
const { env } = require('../../../config/')

const Email = {
  async firstLogin(email, hash) {
    // const body = `
    //   <h2>Здравия желаю, рядовой ! Добро пожаловать в ряды Армии безопасного похудения!</h2>
    //   <p>Чтобы продолжить регистрацию, пройдите по ссылке ниже: </p>
    //   <a href="${env.URL + 'first-login/' + hash}">Продолжить регистрацию</a>
    // `

    const body = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Demystifying Email Design</title>
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
										<b>Здравия желаю, рядовой!</b>
									</td>
								</tr>
								<tr>
									<td style="padding: 20px 0 30px 0; color:  #1d1d22; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Добро пожаловать в ряды Армии безопасного похудения! <br><a href="${env.SITE_URL +
                    'first-login/' +
                    hash}" style="font-family: Arial, sans-serif; line-height: 22px; font-size: 18px;">Продолжить регистрацию</a>
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
										&reg; Культ Тела, 2019<br/>
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

    sendEmail(email, {
      html: body,
      subject: 'Продолжить регистрацию в Культ Тела'
    })
  }
}

module.exports = Email
