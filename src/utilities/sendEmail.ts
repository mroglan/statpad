import sgMail from '@sendgrid/mail'

interface Props {
    name: string;
    email: string;
    link:string;
}

export default async function sendEmail({name, email, link}:Props) {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: email,
        from: 'manueljoseph113@gmail.com',
        subject: 'Verify your email',
        text: 'It worked...',
        html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title></title>
            <!--[if (mso 16)]>
            <style type="text/css">
            a {text-decoration: none;}
            </style>
            <![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
            <!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
            <!--[if !mso]><!-- -->
            <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
            <!--<![endif]-->
        </head>
        
        <body>
            <div class="es-wrapper-color">
                <!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                        <v:fill type="tile" color="#f4f4f4"></v:fill>
                    </v:background>
                <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr class="gmail-fix" height="0">
                            <td>
                                <table width="600" cellspacing="0" cellpadding="0" border="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td cellpadding="0" cellspacing="0" border="0" style="line-height: 1px; min-width: 600px;" height="0"><img src="https://esputnik.com/repository/applications/images/blank.gif" style="display: block; max-height: 0px; min-height: 0px; min-width: 600px; width: 600px;" alt width="600" height="1"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td class="esd-email-paddings" valign="top">
                                <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td class="esd-stripe" style="background-color: #ffa73b;" esd-custom-block-id="6340" bgcolor="#ffa73b" align="center">
                                                <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-structure" align="left">
                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                                <table style="background-color: #ffffff; border-radius: 4px; border-collapse: separate;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-p35t es-p5b es-p30r es-p30l" align="center">
                                                                                                <h1>Welcome ${name}!</h1>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="esd-block-spacer es-p5t es-p5b es-p20r es-p20l" bgcolor="#ffffff" align="center" style="font-size:0">
                                                                                                <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0">
                                                                                                    <tbody>
                                                                                                        <tr>
                                                                                                            <td style="border-bottom: 1px solid #ffffff; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                        </tr>
                                                                                                    </tbody>
                                                                                                </table>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td class="esd-stripe" align="center">
                                                <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td class="esd-structure" align="left">
                                                                <table width="100%" cellspacing="0" cellpadding="0">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="esd-container-frame" width="600" valign="top" align="center">
                                                                                <table style="border-radius: 4px; border-collapse: separate; background-color: #ffffff;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-p20t es-p20b es-p30r es-p30l es-m-txt-l" bgcolor="#ffffff" align="left">
                                                                                                <p>Before you can begin stat padding, you need to verify your email address.</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="esd-block-button es-p35t es-p35b es-p10r es-p10l" align="center"><span class="es-button-border"><a href=${link} class="es-button" target="_blank" style="border-width: 15px 30px;"> Confirm Account</a></span></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-p20t es-p30r es-p30l es-m-txt-l" align="left">
                                                                                                <p>If that doesn't work, copy and paste the following link in your browser:</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-p20t es-p30r es-p30l es-m-txt-l" align="left"><a target="_blank" href="${link}">${link}</a></td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td class="esd-block-text es-p20t es-p40b es-p30r es-p30l es-m-txt-l" align="left">
                                                                                                <p>Good day,</p>
                                                                                                <p>The Statpad Team</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        
        </html>`
    }

    await sgMail.send(msg)
}