import { IMailAccountSettings } from "../interfaces/account.interfaces";
import { IDbMail, IMailPayload } from "../interfaces/mail.interfaces";
import accountController from "./account.controller";
import * as mailer from "../utils/mailer"
import mailModel from "../models/mail.model";
import moment from "moment";
import * as autosender from './autosender'
import receiverController from "./receiver.controller";
import { messageFormaterContractor, messageFormaterMember } from "./messageFormater";
import { IContractor, IMember } from "../interfaces/receiver.interface";
import Logger from "../library/Logger";

const QRCode = require('qrcode');

var mailsSendTimeouts: any = []

const mailController = {
    send: (opts: IMailPayload, mailConfigs: IMailAccountSettings[]) => {
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

                payload.push([
                    opts.cid, 1,
                     0,  0, 0,
                    opts.user || 0,
                    r.email || r.Email || '',
                    message, opts.subject || '',
                    '', 'waiting',
                    opts.sendDate || moment().format('YYYY-MM-DD HH:mm:ss'),
                    opts.module || '',
                    opts.element || null
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

    // updateAccount: function (data: { Wartosc: any; user: any; pass: any; host: any; port: any; alias: any; cid: any; }, encrypt: any, cid: any, callback: (arg0: any) => any) {
    //     data.Wartosc = utils.encrypt(JSON.stringify({ user: data.user, pass: data.pass, host: data.host, port: data.port, alias: data.alias }), encrypt)
    //     data.cid = cid
    //     emailsQuery.updateAccount(data, function (err: any, result: any) {
    //         if (err)
    //             throw err
    //         return callback(result)
    //     })
    // },
    // removeAccount: function (modul: any, cid: any, callback: (arg0: any) => any) {
    //     emailsQuery.removeAccount(modul, cid, function (err: any, result: any) {
    //         if (err)
    //             throw err
    //         return callback(result)
    //     })
    // },
    // getMails: function (cid: any, pass: any, callback: (arg0: any) => any) {
    //     emailsQuery.getMails(cid, function (err: any, result: string | any[]) {
    //         if (err)
    //             throw err
    //         for (var i = 0; i < result.length; i++) {
    //             result[i].Nazwa = utils.decrypt(result[i].Nazwa, pass)
    //         }

    //         return callback(result)
    //     })
    // },
    // updateStatus: function (id: any, status: any) {
    //     return new Promise((resolve, reject) => {
    //         emailsQuery.updateStatus(id, status, function (result: any) {
    //             return resolve(result)
    //         })
    //     })

    // },
    // formatMessage: function (text: string, contractor: any) {
    //     return new Promise(async (resolve, reject) => {
    //         try {


    //             let qrCode = await QRCode.toDataURL(contractor.authorizedData.number + contractor.authorizedData.code + '')
    //             // for (var field = 0; field < contractor.length; field++)
    //             //     text = (text || '').replace(new RegExp('\\{' + field + '\\}', "g"), contractor[field] || '')
    //             text = text.replace(new RegExp('\\{Odbiorca\\.Imie\\}', "g"), contractor.Imie || contractor.Nazwa || contractor.Nazwa_skrot)
    //             text = text.replace(new RegExp('\\{Odbiorca\\.Nazwisko\\}', "g"), contractor.Nazwisko || '')
    //             text = text.replace(new RegExp('\\{Odbiorca\\.Kod\\}', "g"), contractor.authorizedData.code || '')
    //             text = text.replace(new RegExp('\\{Odbiorca\\.Numer\\}', "g"), contractor.authorizedData.number || '')
    //             text = text.replace(new RegExp('\\{Odbiorca\\.QR\\}', "g"), `<img src="${qrCode}"/>` || '')
    //             return resolve(text)
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     })
    // },
    // update: function (data: { message: any; contractors: any[]; sendToAll: string; cid: any; groups: any; permission: any; }, opts: { encrypt: any; }) {
    //     return new Promise(async function (resolve, reject) {

    //         if (!data.message) return resolve({ err: 'Brak wiadomości' })

    //         // const smsCredits = await smsController.checkSmsCredits(opts)
    //         // console.log('smsCredits', smsCredits)

    //         var allContractors = [];
    //         // data.contractors = data.contractors || []

    //         if (data.sendToAll == 'true') { //jezeli ma wysłać do wszystkich
    //             allContractors = await contractorsController.get({ company: data.cid, encrypt: opts.encrypt, phoneNumbers: true })
    //             allContractors = allContractors.contractors
    //             data.contractors = []
    //             data.contractors = joinContractorsWithoutDuplicates(data.contractors, allContractors)

    //         }

    //         var contractorsFromCategories = await contractorsController.getContractorsFromCategories(data.groups || [], opts)

    //         let joinedContractors: any[] = joinContractorsWithoutDuplicates(data.contractors || [], contractorsFromCategories)
    //         if (joinedContractors)
    //             return resolve(data.contractors)
    //         let contractorsCount = data.contractors.length
    //         if (!contractorsCount) //jezeli nie ma żadnego odbiorcy
    //             return resolve({ err: `Brak odbiorców` })
    //         if (!data.permission) {

    //             return resolve({
    //                 alert: `Twoja wiadomość zostanie wysłana do ${contractorsCount} ${contractorsCount == 1 ? 'kontrahenta' : 'kontrahentów'}. 
    //                     Ilość wiadomości email: ${contractorsCount}.
    //                     Czy chcesz wysłać tę wiadomość?` })
    //         }

    //         main.updateMail(data, opts, function (result: unknown) {
    //             // smsController.sendAuto();
    //             return resolve(result)
    //         })

    //     })
    // },
    // updateMail: async function (data: any, opts: any, callback: (arg0: string) => any) {
    //     var payload = []
    //     for (let x of data.contractors) {
    //         let authorizedData = await contractorsController.getAuthorizedData({
    //             company: opts.company,
    //             encrypt: opts.encrypt,
    //             contractor: x.ID
    //         })
    //         x.authorizedData = authorizedData
    //         let message = await main.formatMessage(data.message, x)
    //         payload.push([
    //             data.cid, 1,
    //             opts.sid || '', x.ID, opts.user || '',
    //             x.Email || '',
    //             message, data.subject || '',
    //             '', opts.status || 'waiting',
    //             data.sendDate || moment().format('YYYY-MM-DD HH:mm:ss'),
    //             data.module || 'ci',
    //             JSON.stringify(x)
    //         ])
    //     }
    //     await emailsQuery.updateMail({ multiple: true }, [payload])

    //     main.sendAuto()

    //     if (callback)
    //         return callback('OK')

    // },
    // sendAuto: async function () {

    //     //sprawdz czy sa jakies cykle do wykoania, jezeli tak to dodaje wiadomosci do wysłania
    //     // await smsController.checkCycle();


    //     emailsQuery.getForSend({}, async function (err: any, messages: string | any[]) {
    //         mailsSendTimeouts.forEach(function (timeout: string | number | NodeJS.Timeout | undefined) {
    //             clearTimeout(timeout)
    //         })
    //         mailsSendTimeouts = []

    //         let mailsToSend = []
    //         let messagesIds = []
    //         for (let i = 0; i < messages.length; i++) {
    //             let message = messages[i];
    //             if (moment(message.date).isBefore(moment()) || moment(message.date).isSame(moment(), 'minutes')) {
    //                 messagesIds.push(message.id)
    //                 // mailsToSend.push({ email: message.email, contractor: message.contractor_data, subject: message.subject || '' })

    //                 await main.updateStatus([message.id], 'pending')
    //                 main.send({
    //                     id: message.id,
    //                     date: moment(message.date).format('YYYY-MM-DD HH:mm:ss'),
    //                     cid: message.company,
    //                     encrypt: message.encrypt,
    //                     message: message.desc,
    //                     user: message.user,
    //                     sid: message.sid,
    //                     // email: message.email,
    //                     // contractor: message.contractor_data,
    //                     // subject: message.subject || '' ,
    //                     mails: [{ email: message.email, contractor: message.contractor_data, subject: message.subject || '' }],
    //                     module: 'ci'
    //                 })
    //             }


    //         }

    //         // if (mailsToSend.length) {
    //         //     for (let message of mailsToSend) {
    //         //         await main.updateStatus(messagesIds, 'pending')
    //         //         main.send({
    //         //             id: message.id,
    //         //             date: moment(message.date).format('YYYY-MM-DD HH:mm:ss'),
    //         //             cid: message.company,
    //         //             encrypt: message.encrypt,
    //         //             message: message.desc,
    //         //             user: message.user,
    //         //             sid: message.sid,
    //         //             mails: mailsToSend
    //         //         })
    //         //     }
    //         // }


    //         console.log('mailsQueue', mailsToSend.length)

    //     })


    // },


}



// function getContractorsFromIds(opts: { company: any; encrypt: any; ids: any; }) {
//     return new Promise((resolve, reject) => {
//         contractorsController.get({ company: opts.company, encrypt: opts.encrypt, ids: opts.ids }, function (err: any, contractors: { contractors: unknown; }) {
//             return resolve(contractors.contractors)
//         })
//     })

// }

// function joinContractorsWithoutDuplicates(arr1: any[], arr2: string | any[]) {
//     if (arr2.length > 0) {

//         arr1 = arr1.concat(arr2)

//         arr1 = arr1.reduce(function (a: any[], b: { Email: any; }) {
//             !a.find(function (x: { email: any; Email: string | any[]; }) {
//                 if (x.email && x.Email.length > 0 && x.Email == b.Email)
//                     return true
//             }) ? a.push(b) : '';
//             return a;
//         }, []);
//         return arr1;
//     }
//     return arr1;
// }

// function countMailsAmount(contractors: any[], message: any) {
//     let mailsAmount = 0;
//     contractors.forEach((c: any) => {
//         let m = main.formatMessage(message, c);
//         if (containsPolishCharacters(m))
//             mailsAmount += Math.ceil(m.length / 70)
//         else
//             mailsAmount += Math.ceil(m.length / 160)

//     })
//     return mailsAmount;
// }


export default mailController;