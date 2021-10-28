export class CommentModel {
    signalId: string;
    companyId: string;
    userId: string;
    profileId: string;
    username: string;
    companyName: string;
    value: string;
    rating: number;
    sentiment: number;
    emotions: string[];
    createdOn: Date;
}