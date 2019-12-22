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
    <div>
      <div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
        <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffd92b;">
        <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffd92b;"><td style="width: 600px" class="w560"><![endif]-->
          <div class="column" style="text-align: left;color: #000;font-size: 14px;line-height: 21px;font-family: Avenir,sans-serif;">
        
            <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">
        <h4 style="Margin-top: 0;Margin-bottom: 0;font-style: normal;font-weight: normal;color: #000;font-size: 34px;line-height: 25px;text-align: center;"><strong>Здравия желаю, рядовой!</strong></h1><h2 style="Margin-top: 20px;Margin-bottom: 16px;font-style: normal;font-weight: normal;color: #000;font-size: 28px;line-height: 36px;text-align: center;"><strong>Добро пожаловать в ряды Армии безопасного похудения!</strong></h4>
      </div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 1px;">&nbsp;</div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;">
      <div class="btn fullwidth btn--ghost btn--large" style="Margin-bottom: 20px;text-align: center;">
        <!--[if !mso]--><a style="border-radius: 0;display: block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #000000 !important;border: 1px solid #000;font-family: Avenir, sans-serif;" href="${env.URL +
          'first-login/' +
          hash}" target="_blank">Продолжить регистрацию</a><!--[endif]-->
      <!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:rect xmlns:v="urn:schemas-microsoft-com:vml" href="http://test.com" style="width:558px" filled="f" strokecolor="#000000" strokeweight="1px"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,12px,0px,12px"><center style="font-size:14px;line-height:24px;color:#000000;font-family:Avenir,sans-serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">&#1055;&#1088;&#1086;&#1076;&#1086;&#1083;&#1078;&#1080;&#1090;&#1100; &#1088;&#1077;&#1075;&#1080;&#1089;&#1090;&#1088;&#1072;&#1094;&#1080;&#1102;</center></v:textbox></v:rect><![endif]--></div>
    </div>
        
            <div style="Margin-left: 20px;Margin-right: 20px;Margin-bottom: 24px;">
      <div style="mso-line-height-rule: exactly;line-height: 10px;font-size: 1px;">&nbsp;</div>
    </div>
        
          </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </div>
      </div>
  
      
      <div role="contentinfo">
        <div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]-->
            <div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #000;font-family: Avenir,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
                <div style="font-size: 12px;line-height: 19px;">
                  <div>(c) Культ Тела 2019</div>
                </div>
                <div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">
                  <div>Это автоматическое сообщение, не отвечайте на него!</div>
                </div>
                <!--[if mso]>&nbsp;<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]-->
            <div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #000;font-family: Avenir,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);">
              <div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">
                
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
        <div class="layout one-col email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">
          <div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">
          <!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 600px;" class="w560"><![endif]-->
            
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="line-height:40px;font-size:40px;">&nbsp;</div>
    </div>`

    sendEmail(email, {
      html: body,
      subject: 'Продолжить регистрацию в Культ Тела'
    })
  }
}

module.exports = Email
