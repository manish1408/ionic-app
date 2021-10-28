export class NotificationModel {
    type: string;
    userId: string;
    deepLink: string;
    payloadMain: string;
    payloadSecondary: string;
    payloadValue: string;
    createdOn: Date;
    expiresOn: Date;
}