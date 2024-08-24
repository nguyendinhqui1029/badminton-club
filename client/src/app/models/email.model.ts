export interface EmailResponseValue {
    to: string;
    subject: string;
    cc?: string;
    text: string;
    html?: string;
    status?: 'DRAFT' | 'PENDING' | 'EXPIRED' | 'ERROR' | 'SUCCESS';
    sendDate: string; // Date as string, could also be Date type
    type: string; // Type of email
    createdAt: string; // Date type
    updatedAt: string; // Date type
}

export interface EmailRequestBody {
    to: string;
    subject: string;
    cc?: string;
    text: string;
    html?: string;
    sendDate: Date;
    type: string;
}