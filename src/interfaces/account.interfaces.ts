


export interface IDbSettings {
    Id: number,
    Firma: number,
    Id_sesji: number,
    Nazwa: string,
    Wartosc: string,
    Aktywny: boolean,
    Encrypt: string | any
}

export interface IMailAccountSettings {
    name: string,
    host: string,
    port: number,
    smtpPort: number,
    user: string,
    password?: string, 
    alias: string,
    desc?: string
}
