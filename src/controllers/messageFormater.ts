import { IContractor, IMember } from "interfaces/receiver.interface";

const QRCode = require('qrcode');

export const messageFormaterContractor = async (message: string, contractor: IContractor) => {
    contractor.Number = (contractor.ID + '').padStart(9, '0')

    let qrCode = await QRCode.toDataURL(contractor.Number + contractor.Code + '')
    // for (let field in contractor)
    //     message = (message || '').replace(new RegExp('\\{' + field + '\\}', "g"), contractor[field] || '')
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Imie\\}', "g"), contractor.Imie || contractor.Nazwa || contractor.Nazwa_skrot)
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Nazwisko\\}', "g"), contractor.Nazwisko || '')
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Kod\\}', "g"), contractor.Code || '')
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Numer\\}', "g"), contractor.Number || '')
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.QR\\}', "g"), `<img src="${qrCode}"/>` || '')
    return message;
}

export const messageFormaterMember = (message: string, member: IMember) => {
    // for (let field in member)
    //     message = (message || '').replace(new RegExp('\\{' + field + '\\}', "g"), member[field] || '')
    message = message.replace(new RegExp('\\{Odbiorca\\.Imie\\}', "g"), member.Nazwa || member.Imie)
    message = message.replace(new RegExp('\\{Odbiorca\\.Nazwisko\\}', "g"), member.Nazwisko || '')
    message = message.replace(new RegExp('\\{Odbiorca\\.Email\\}', "g"), member.Email || '')
    message = message.replace(new RegExp('\\{Odbiorca\\.Telefon\\}', "g"), member.Telefon || '')

    return message;
}