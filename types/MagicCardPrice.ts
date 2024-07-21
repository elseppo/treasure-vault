import {MagicCard} from '@/lib/model/MagicCard';

export interface MagicCardPrice {
    id: number;
    createdAt?: Date;
    usd?: number;
    usd_foil?: number;
    usd_etched?: number;
    eur?: number;
    eur_foil?: number;
    tix?: number;
    magicCardId: string;
    magicCards: MagicCard;
}