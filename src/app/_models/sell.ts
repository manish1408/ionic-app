import { Money } from "./money";

export class Sell {
    symbol: string;
    buy: number[];
    sell: number[];
    stopLoss: number;
    durationInHours: number;
    scheduleAt: Date;
    exchange: string;
    documents: File[];
    description: string;
    price: Money;
    isPartOfSubscription: boolean;
    isPremium: boolean;
    isFree: boolean;
    isDefault: boolean;
    companyId: string;
}