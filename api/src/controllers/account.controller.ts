import {  IMailAccountSettings } from "../interfaces/account.interfaces";


const accountController = {
    get: (user: number,  isPublic: boolean): Promise<IMailAccountSettings | Object> => {
        return new Promise(async (resolve, reject) => {
            let mailConfig: IMailAccountSettings | Object = {
                name: 'DEFAULT ACCOUNT',
                host: process.env.MAILER_HOST,
                port: process.env.MAILER_SMTP_PORT,
                smtpPort: process.env.MAILER_SMTP_PORT,
                user: process.env.MAILER_USER,
                alias: '',
                password: isPublic ? '' : process.env.MAILER_PASS
            }


            return resolve(mailConfig)
        })
    }
}

export default accountController;