import config from "../config";
import { IMailAccountSettings } from "interfaces/account.interfaces";
import Logger from "../library/Logger";
import * as nodemailer from 'nodemailer';
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const nodemailerOpenpgp = require('nodemailer-openpgp');


export const send = (
    mailOptions: {
        to: string,
        subject: string,
        body: string,
        ssl?: boolean,
        attachments: any,
        password: string,
        publicKey: string
    },
    mailConfig: IMailAccountSettings | any,
    keys: {
        publicKey: string,
        privateKey: string
    }
): Promise<any> => {
    try {

        return new Promise(async (resolve, reject) => {

            let options = {
                from: {
                    name: mailConfig.alias || config.MAILER_USER,
                    address: mailConfig.user || config.MAILER_ADDRESS
                },
                to: mailOptions.to,
                subject: mailOptions.subject,
                html: mailOptions.body,
                attachments: mailOptions.attachments,
                encryptionKeys: [mailOptions.publicKey],
                shouldSign: true
            }

            if (config.TEST)
                return resolve({ messageId: '<7e535136-9ea9-f6b1-0d35-8d2433c39418@gmail.com>', from: options.from.address })

            options.encryptionKeys = [keys.publicKey]

            const transporter = nodemailer.createTransport({
                host: mailConfig.host || mailConfig.user || config.MAILER_HOST,
                port: mailConfig.port || config.MAILER_SMTP_PORT,
                secure: typeof (mailOptions.ssl) != undefined ? mailOptions.ssl : (process.env.MAIL_SSL == '1'),
                requireTLS: false,
                auth: {
                    user: mailConfig.user || config.MAILER_USER,
                    pass: mailConfig.password || config.MAILER_PASS
                },
                logger: false
            });
            transporter.use('compile', inlineBase64({ cidPrefix: 'img_' }));

            transporter.sendMail(options, function (err, info) {
                transporter.close()
                if (err) {
                    Logger.error(err)
                    return resolve({ err })
                }
                return resolve({ ...info, from: options.from.address })
            })
        });

    } catch (error) {
        Logger.error(`[mysql.connector][execute][Error]: ${error}`);
        throw new Error('failed to execute MAILER query');
    }
}

export const verifyAccount = (data: any) => {
    return new Promise(function (resolve, reject) {
        if (!data.user || !data.pass || !data.host || !data.port)
            return resolve({ err: true, msg: 'Brak danych' })

        let config = {
            name: process.env.SMTP_DOMAIN,
            host: data.host,
            port: data.port,
            secure: false,
            auth: {
                user: data.user,
                pass: data.pass
            },
        }

        if (config.port == 465) {
            config.secure = true
        } else {
            config.secure = false

        }
        let transporter = nodemailer.createTransport(config)
        transporter.verify((err: Error | null) => {
            if (err) {
                console.log(err)
                let data = {
                    err: true,
                    msg: 'Nie udało się nawiązać połączenia. Błąd: ' + err.message
                }

                return resolve(data)

            } else {
                return resolve({ msg: 'Udało się nawiązać połączenie.' })
            }
        })
    })
}

