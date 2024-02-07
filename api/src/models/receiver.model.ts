import { execute, escape } from "../utils/dbMain"
import { IContractor, IMember } from "interfaces/receiver.interface"

const receiverModel = {
    getContractors: async (params: { cid: number, ids: number[] }) => {
        let query = `SELECT k.*, c.code, o.Encrypt FROM ${process.env.DB_DATABASE}.fv_Kontrahenci k
        INNER JOIN ${process.env.DB_DATABASE}.Oddzialy o ON o.id = k.ID_Oddzialu
        WHERE k.Aktywny AND k.ID_Oddzialu = ${escape(params.cid)} AND k.ID IN (${escape(params.ids)});`
        return execute<IContractor[]>(query, [], false)
    },
    getMembers: async (params: { cid: number, ids: number[] }) => {
        let query = `SELECT u.* FROM firmotron_staging.em_Uczestnicy u
            WHERE u.Aktywny AND u.Firma = ${escape(params.cid)} AND u.ID IN (${escape(params.ids)}) ;`
        return execute<IMember[]>(query, [], false)
    }
}

export default receiverModel;