import accountModel from "../models/account.model";
import { decrypt } from "../utils/tools";
import { IDbSettings, IMailAccountSettings } from "../interfaces/account.interfaces";
import config from "../config"

const accountController = {
    get: (user: number, name: string, isPublic: boolean): Promise<IMailAccountSettings | Object> => {
        return new Promise(async (resolve, reject) => {
            let dbAccount = await accountModel.get(user);
            var emailSettings: IMailAccountSettings[] = []

            if (dbAccount.length) {
                dbAccount.map((x: IDbSettings) => {
                    if (x.Wartosc != '') {
                        let values = JSON.parse(decrypt(x.Wartosc, x.Encrypt))
                        emailSettings.push({
                            name: values.name || 'DEFAULT ACCOUNT',
                            host: values.host || config.MAILER_HOST,
                            port: values.port || config.MAILER_SMTP_PORT,
                            smtpPort: values.smtpPort || config.MAILER_SMTP_PORT,
                            user: values.user || config.MAILER_USER,
                            alias: values.alias || '',
                            password: isPublic ? '' : config.MAILER_PASS
                        })
                    }
                })
            }
           
           

            


            let mailConfig: IMailAccountSettings | IMailAccountSettings[] | Object = name == 'all' ? emailSettings : emailSettings.find((x: { name: string; }) => x.name == name) || {}


            return resolve(mailConfig)
        })
    }
}

export default accountController;