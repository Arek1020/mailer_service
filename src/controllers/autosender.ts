import { IDbMail } from "../interfaces/mail.interfaces";
import mailModel from "../models/mail.model";
import moment from "moment";
import accountController from "./account.controller";
import { send } from "../utils/mailer";
import Logger from "../library/Logger";
import { join } from "path";
import { decrypt, encrypt } from "../utils/cryptography";
import userModel from "../models/user.model";
import config from "./../config";

export const start = async () => {
    Logger.info('AUTOSENDER START')

    let waitingMails: IDbMail[] = await mailModel.get({ status: 'waiting' })
    let mailsToSend = waitingMails.filter(m => moment(m.date).isSameOrBefore(moment(), 'minutes'))
    Logger.info(`waitingMails: ${waitingMails.length}, mailsToSend: ${mailsToSend.length}`)

    for (let mailToSend of mailsToSend) {
        mailModel.update({ id: mailToSend.id, status: 'pending' })
        let dbUser = await userModel.findOne({ id: mailToSend.user })
        let mailConfig = await accountController.get(mailToSend.user, mailToSend.module || '', false)

        let attachments: { path: string, password: string; sms: boolean }[] = [];
        if (mailToSend.attachments)
            try {
                attachments = JSON.parse(mailToSend.attachments)
            } catch {
                attachments = []
            }

        const messageLink = `${config.VIEW_URL}/decrypt/${mailToSend.id}`
        const message = `<html> <a href="${messageLink}"> ODSZYFRUJ WIADOMOŚĆ</a></html>`

        let mailOptions = {
            to: mailToSend.email,
            subject: mailToSend.subject,
            body: message,
            password: decrypt(mailToSend.password, dbUser?.encrypt || config.SECRETKEY),
            attachments: attachments?.map((x: {
                password: string; path: string; sms: boolean;
            }, index: any) => {
                return {
                    // filename: `zal_${index + 1}${x.path.includes('.zip') ? '.zip' : ''}`,
                    path: join(__dirname, x.path)
                }
            }),
            publicKey: mailToSend.publicKey
        }


        let mailResponse = await send(
            mailOptions,
            mailConfig,
            {
                publicKey: decrypt(dbUser.publicKey || '', dbUser.encrypt || ''),
                privateKey: decrypt(dbUser.privateKey || '', dbUser.encrypt || '')
            }
        )
        if (mailResponse?.err)
            mailModel.update({
                id: mailToSend.id,
                status: 'unsend',
                error: mailResponse?.err,
                date_delivered: moment().format('YYYY-MM-DD HH:mm'),
                from: mailResponse.from
            })
        else
            mailModel.update({
                id: mailToSend.id,
                status: 'sent',
                message_id: mailResponse?.messageId,
                date_delivered: moment().format('YYYY-MM-DD HH:mm'),
                from: mailResponse.from
            })
    }
}

// export default autosender;