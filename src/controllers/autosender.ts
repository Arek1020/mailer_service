import { IDbMail } from "../interfaces/mail.interfaces";
import mailModel from "../models/mail.model";
import moment from "moment";
import accountController from "./account.controller";
import { send } from "../utils/mailer";
import Logger from "../library/Logger";


export const start = async () => {
    Logger.info('AUTOSENDER START')

    let waitingMails: IDbMail[] = await mailModel.get({ status: 'waiting' })
    let mailsToSend = waitingMails.filter(m => moment(m.date).isSameOrBefore(moment(), 'minutes'))
    Logger.info(`waitingMails: ${waitingMails.length}, mailsToSend: ${mailsToSend.length}`)

    for (let mailToSend of mailsToSend) {
        mailModel.update({ id: mailToSend.id, status: 'pending' })
        let mailConfig = await accountController.get(mailToSend.user, mailToSend.module || '', false)
        let mailOptions = {
            to: mailToSend.email,
            subject: mailToSend.subject,
            body: mailToSend.desc,
        }

        let mailResponse = await send(mailOptions, mailConfig)
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