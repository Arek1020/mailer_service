import { IDbMail, IMailPayload, IAttachment } from "../interfaces/mail.interfaces";
import mailModel from "../models/mail.model";
import moment from "moment";
import * as autosender from './autosender'
import Logger from "../library/Logger";
import { archive } from "../utils/archivier";
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { removeDiacritics } from "../utils/diacritics";
import { encrypt } from "../utils/cryptography";
import config from "./../config";

const mailController = {
    send: (opts: IMailPayload) => {
        console.log('--SEND-MAIL', opts)
        return new Promise(async (resolve, reject) => {
            if (!opts.message) {
                Logger.error(`NO_MESSAGE ${opts}`)
                return resolve({ error: 'NO_MESSAGE', msg: 'Brak wiadomości' })
            }
            if (!opts.receivers?.length) {
                Logger.error(`NO_RECEIVERS ${opts}`)
                return resolve({ error: 'NO_RECEIVERS', msg: 'Brak odbiorców' })
            }

            // let mailConfig = mailConfigs.find((x: { modul: string; }) => x.modul == opts.module || x.modul == 'ci') || {}
            let payload = [];


            for (let r of opts.receivers) {

                let message = opts.message

                message = `<html>${message}</html>`

                let attachmentsPath: { path: string }[] | null = null;
                if (opts.attachments?.length)
                    attachmentsPath = await mailController.saveAttachments(opts.attachments, true, opts.cid, opts.password)

                attachmentsPath = attachmentsPath?.map(x => { return { ...x } }) || null


                payload.push([
                    opts.cid, 1,
                    0, 0, 0,
                    opts.user || 0,
                    r.email || r.Email || '',
                    message, opts.subject || '',
                    '', 'waiting',
                    opts.sendDate || moment().format('YYYY-MM-DD HH:mm:ss'),
                    opts.module || '',
                    opts.element || null,
                    attachmentsPath ? JSON.stringify(attachmentsPath) : null,
                    encrypt(opts.password || '', config.SECRETKEY)
                ])

            }

            await mailModel.insertMany([payload])

            autosender.start();

            return resolve('OK')

        })

    },
    log: async function (opts: { id: number; cid: number; sid: number; user: string; date: string; module: string; encrypt: string; }, mail: { email: string; message: string; }, mailResponse: { envelope: { from: any; }; messageId: any; err: any; }) {
        let data = {
            id: opts.id,
            company: opts.cid,
            active: 1,
            sid: opts.sid || '',
            user: opts.user || '',
            email: mail.email || '',
            from: mailResponse?.envelope?.from || '',
            desc: mail.message,
            message_id: mailResponse.messageId,
            status: mailResponse.err ? 'unsent' : 'sent',
            date: opts.date || moment().format('YYYY-MM-DD HH:mm:ss'),
            date_delivered: moment().format('YYYY-MM-DD HH:mm:ss'),
            module: opts.module || '',
        }

        mailModel.update(data)
    },
    saveAttachments: async (attachments: IAttachment[], _encrypt?: boolean, company?: number, attachmentPassword?: string) => {
        const catalogTimestamp = Date.now() + ''
        let path = join('../tmp', catalogTimestamp);
        let filesPaths: string[] = []

        // Tworzymy folder tmp, jeśli nie istnieje
        if (!existsSync(join(__dirname, '../tmp'))) {
            mkdirSync(join(__dirname, '../tmp'));
        }

        // Tworzymy folder, jeśli nie istnieje
        if (!existsSync(join(__dirname, path))) {
            mkdirSync(join(__dirname, path));
        }

        let counter: number = 1;
        for (let attachment of attachments) {
            try {
                let filePath = join(__dirname, path, counter + '_' + removeDiacritics(attachment.originalname))
                writeFileSync(filePath, Buffer.from(attachment.buffer));
                filesPaths.push(join(path, counter + '_' + removeDiacritics(attachment.originalname)))
                console.log('File saved successfully!', removeDiacritics(attachment.originalname));
                counter++;
            } catch (error) {
                console.error('Error saving file:', error);
            }
        }
        let password = '';

        if (_encrypt) {
            password = attachmentPassword || generateReadablePassword(8)
            archive(join(__dirname, path), join(__dirname, '../tmp', catalogTimestamp + '.zip'), password)
            path += '.zip'
        }

        return _encrypt ?
            [{ path }]
            :
            filesPaths.map(x => { return { path: x } })
    }
}


const generateReadablePassword = (length: number): string => {
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    const allCharacters = lowercaseLetters + uppercaseLetters + numbers + symbols;

    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters.charAt(randomIndex);
    }

    return password;
}


export default mailController;