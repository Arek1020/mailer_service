


export interface IMailPayload {
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
}


export interface IDbMail {
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

}