import { IAttachment, IDbMail } from "../interfaces/mail.interfaces";
import mailModel from "../models/mail.model";
import moment from "moment";
import accountController from "./account.controller";
import { send } from "../utils/mailer";
import Logger from "../library/Logger";
import { join } from "path";
import { decrypt } from "../utils/cryptography";
import userModel from "../models/user.model";
import { IDbUser } from "interfaces/user.interfaces";
import { IMailAccountSettings } from "interfaces/account.interfaces";

export const start = async () => {
    Logger.info('AUTOSENDER START')

    let waitingMails: IDbMail[] = await mailModel.get({ status: 'waiting' })
    let mailsToSend = waitingMails.filter(m => moment(m.date).isSameOrBefore(moment(), 'minutes'))
    Logger.info(`waitingMails: ${waitingMails.length}, mailsToSend: ${mailsToSend.length}`)

    for (let mailToSend of mailsToSend) {
        mailModel.update({ id: mailToSend.id, status: 'pending' })

        let dbUser = await userModel.findOne({ id: mailToSend.user })
        let mailConfig = await accountController.get(mailToSend.user, false)

        let preparedMail = await prepareForSend(mailToSend, dbUser, mailConfig)

        let mailResponse = await send(
            preparedMail.mailOptions,
            preparedMail.mailConfig,
            preparedMail?.keys
        )

        if (mailResponse?.err)
            mailModel.update({
                id: preparedMail.id,
                status: 'unsend',
                error: mailResponse?.err,
                date_delivered: moment().format('YYYY-MM-DD HH:mm'),
                from: mailResponse.from
            })
        else
            mailModel.update({
                id: preparedMail.id,
                status: 'sent',
                message_id: mailResponse?.messageId,
                date_delivered: moment().format('YYYY-MM-DD HH:mm'),
                from: mailResponse.from
            })
    }
}

export const prepareForSend = (mailToSend: IDbMail, dbUser: IDbUser, mailConfig: IMailAccountSettings | Object) => {

    let attachments: { path: string, password: string; sms: boolean }[] = [];
    if (mailToSend.attachments)
        try {
            attachments = JSON.parse(mailToSend.attachments)
        } catch {
            attachments = []
        }

    const messageLink = `${process.env.VIEW_URL}/decrypt/${mailToSend.id}`
    const message = `<html> <a href="${messageLink}"> ODSZYFRUJ WIADOMOŚĆ</a></html>`
    const mailOptions = getMailOptions(mailToSend, message, dbUser, attachments)

    return {
        id: mailToSend.id,
        mailOptions,
        mailConfig,
        keys: {
            publicKey: decrypt(dbUser.publicKey || '', dbUser.encrypt || ''),
            privateKey: decrypt(dbUser.privateKey || '', dbUser.encrypt || '')
        }
    }

}

export const getMailOptions = (mailToSend: IDbMail, message: string, dbUser: IDbUser, attachments: { path: string, password: string; sms: boolean }[]) => {

    return {
        to: mailToSend.email,
        subject: mailToSend.subject,
        body: message,
        password: decrypt(mailToSend.password, dbUser?.encrypt || process.env.SECRETKEY),
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

}