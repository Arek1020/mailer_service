import receiverModel from "../models/receiver.model";
import { decrypt } from "../utils/tools";
import { IDbSettings, IMailAccountSettings } from "../interfaces/account.interfaces";
import config from "../config"
import { IContractor, IMember } from "../interfaces/receiver.interface";

const receiverController = {
    getContractors: (params: {cid: number, ids: number[]}): Promise<IContractor[] | []> => {
        return new Promise(async (resolve, reject) => {
            let doc = await receiverModel.getContractors(params)
            // let  doc[i].Encrypt = contractor.
                for (var i = 0; i < doc.length; i++) {
                    doc[i].Nazwa = decrypt(doc[i].Nazwa, doc[i].Encrypt)
                    doc[i].Nazwa_skrot = decrypt(doc[i].Nazwa_skrot,  doc[i].Encrypt)
                    doc[i].Imie = decrypt(doc[i].Imie,  doc[i].Encrypt)
                    doc[i].Nazwisko = decrypt(doc[i].Nazwisko,  doc[i].Encrypt)
                    doc[i].NIP = decrypt(doc[i].NIP,  doc[i].Encrypt)
                    doc[i].REGON = decrypt(doc[i].REGON,  doc[i].Encrypt)
                    // doc[i].Telefon = decrypt(doc[i].Telefon,  doc[i].Encrypt)
                    // doc[i].Telefon_kom = decrypt(doc[i].Telefon_kom,  doc[i].Encrypt)
                    // doc[i].Email = decrypt(doc[i].Email,  doc[i].Encrypt)
                    // doc[i].Adres_Miejscowosc = decrypt(doc[i].Adres_Miejscowosc,  doc[i].Encrypt)
                    // doc[i].Adres_Kod = decrypt(doc[i].Adres_Kod,  doc[i].Encrypt)
                    // doc[i].Adres_Ulica = decrypt(doc[i].Adres_Ulica,  doc[i].Encrypt)
                    // doc[i].Adres_NrLokalu = decrypt(doc[i].Adres_NrLokalu,  doc[i].Encrypt)
                    // doc[i].Adres_NrBudynku = decrypt(doc[i].Adres_NrBudynku,  doc[i].Encrypt)
                    // doc[i].Miejsce_urodzenia = decrypt(doc[i].Miejsce_urodzenia,  doc[i].Encrypt)
                    // doc[i].Numer_dokumentu = decrypt(doc[i].Numer_dokumentu,  doc[i].Encrypt)
                    // doc[i].PESEL = decrypt(doc[i].PESEL,  doc[i].Encrypt)
                    // if (doc[i].contact)
                    //     doc[i].contact = JSON.parse(doc[i].contact)
                    // else
                    //     doc[i].contact = []
                }
            // return console.log('adasdfasdf', contractor)
            return resolve(doc)
        })
    },
    getMembers: (params: {cid: number, ids: number[]}): Promise<IMember[] | []> => {
        return new Promise(async (resolve, reject) => {
            let member = await receiverModel.getMembers(params)
            return resolve(member)
        })
    }
}

export default receiverController;