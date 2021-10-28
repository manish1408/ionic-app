import { CommentModel } from "./commentModel";
import { MediaFileModel } from "./mediaFileModel";
import { SignalStatModel } from "./signalStatModel";
import { TradeModel } from "./tradeModel";
import { UserStatModel } from "./userStatModel";

export class SignalModel {
    id: string;
    symbol: string;
    exchange: string;
    isSelected: boolean;
    potentialProfit: number;
    userStats: UserStatModel;
    signalStats: SignalStatModel;
    trade: TradeModel;
    favoritedUserIds: Array<string>;
    comments: Array<CommentModel>;
    createdOn: Date;
    files: Array<MediaFileModel>;
    description: string;
    userId: string;
    isOwned: any;
    quality: number;
    hasRated: boolean;
    expiredOn: Date;
    scheduleAt: Date;
    hasExpired: boolean;
}