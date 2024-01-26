


export interface IMailPayload {
    attachments: any;
    element: any;
    receiverType: string;
    id: number,
    sendDate: string;
    user: any,
    sid: number,
    message: any,
    subject: string,
    receivers: {
        ID: number
        name: string,
        email: string,
        Email: string,
        contractorId: number;
        memberId: number
    }[];
    cid: any;
    encrypt: any;
    module: string;
    password?: string;
}


export interface IDbMail {
    privateKey: string;
    id: number,
    company: number,
    active: boolean,
    sid: number,
    contractor: number,
    user: number,
    from: string,
    email: string,
    subject: string,
    desc: string,
    message_id: string,
    status: string,
    date: string,
    date_delivered: string,
    element: number,
    module: string,
    attachments: string,
    contractor_data: string
    password: string;
    publicKey: string;
}

export interface IAttachment {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: string;
    size: number;
}