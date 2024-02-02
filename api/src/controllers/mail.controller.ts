import { IDbMail, IMailPayload, IAttachment } from "../interfaces/mail.interfaces";
import mailModel from "../models/mail.model";
import moment from "moment";
import * as autosender from './autosender'
import Logger from "../library/Logger";
import { archive } from "../utils/archivier";
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { removeDiacritics } from "../utils/diacritics";
import { decrypt, encrypt } from "../utils/cryptography";
import config from "../config";
import { IDbUser } from "interfaces/user.interfaces";
import userModel from "../models/user.model";
import * as pgp from "../utils/pgp"

const mailController = {
    send: (opts: IMailPayload, user?: IDbUser) => {
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
            const privateKey = decrypt(user?.privateKey || '', user?.encrypt || '')
            const publicKey = decrypt(user?.publicKey || '', user?.encrypt || '')


            for (let r of opts.receivers) {

                let message = await pgp.encrypt(opts.message, opts.password || '', privateKey || '', publicKey || '')
                if ((message as any).err)
                    return resolve({ error: 'ENCRYPT_ERROR', msg: "Błąd szyfrowania" })


                let attachmentsPath: { path: string }[] | null = null;
                if (opts.attachments?.length)
                    attachmentsPath = await mailController.saveAttachments(opts.attachments, true, opts.cid, opts.password)

                attachmentsPath = attachmentsPath?.map(x => { return { ...x } }) || null


                payload.push([
                    opts.cid, 1,
                    0, 0, 0,
                    user?.id || 0,
                    r.email || r.Email || '',
                    message, opts.subject || '',
                    '', 'waiting',
                    opts.sendDate || moment().format('YYYY-MM-DD HH:mm:ss'),
                    opts.module || '',
                    opts.element || null,
                    attachmentsPath ? JSON.stringify(attachmentsPath) : null,
                    encrypt(opts.password || '', user?.encrypt || config.SECRETKEY),
                    encrypt(publicKey || '', user?.encrypt || config.SECRETKEY),
                    encrypt(privateKey || '', user?.encrypt || config.SECRETKEY)
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
    },
    decrypt: async (params: any) => {
        let dbMail = await mailModel.findOne({ id: params.messageId })

        if (!dbMail?.user)
            return { err: 'Nie znaleziono wiadomości' }

        let dbUser = await userModel.findOne({ id: dbMail.user })

        const privateKey = decrypt(dbMail?.privateKey || '', dbUser?.encrypt || '')
        const publicKey = decrypt(dbMail?.publicKey || '', dbUser?.encrypt || '')
        const passphrase = decrypt(dbMail?.password || '', dbUser?.encrypt || '')

        let decryptedMessage = await pgp.decrypt(dbMail.desc, passphrase, privateKey || '', publicKey || '')
        return decryptedMessage;
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