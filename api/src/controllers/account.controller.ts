import {  IMailAccountSettings } from "../interfaces/account.interfaces";
import config from "../config"

const accountController = {
    get: (user: number, name: string, isPublic: boolean): Promise<IMailAccountSettings | Object> => {
        return new Promise(async (resolve, reject) => {
            let mailConfig: IMailAccountSettings | Object = {
                name: 'DEFAULT ACCOUNT',
                host: config.MAILER_HOST,
                port: config.MAILER_SMTP_PORT,
                smtpPort: config.MAILER_SMTP_PORT,
                user: config.MAILER_USER,
                alias: '',
                password: isPublic ? '' : config.MAILER_PASS
            }


            return resolve(mailConfig)
        })
    }
}

export default accountController;