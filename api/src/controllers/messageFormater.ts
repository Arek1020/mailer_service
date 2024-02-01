import { IContractor, IMember } from "interfaces/receiver.interface";


export const messageFormaterContractor = async (message: string, contractor: IContractor) => {
    contractor.Number = (contractor.ID + '').padStart(9, '0')

    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Imie\\}', "g"), contractor.Imie || contractor.Nazwa || contractor.Nazwa_skrot)
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Nazwisko\\}', "g"), contractor.Nazwisko || '')
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Kod\\}', "g"), contractor.Code || '')
    message = (message || '').replace(new RegExp('\\{Odbiorca\\.Numer\\}', "g"), contractor.Number || '')
    return message;
}

export const messageFormaterMember = (message: string, member: IMember) => {
    message = message.replace(new RegExp('\\{Odbiorca\\.Imie\\}', "g"), member.Nazwa || member.Imie)
    message = message.replace(new RegExp('\\{Odbiorca\\.Nazwisko\\}', "g"), member.Nazwisko || '')
    message = message.replace(new RegExp('\\{Odbiorca\\.Email\\}', "g"), member.Email || '')
    message = message.replace(new RegExp('\\{Odbiorca\\.Telefon\\}', "g"), member.Telefon || '')

    return message;
}