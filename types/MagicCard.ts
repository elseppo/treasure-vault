import {MagicCardPrice} from '@/lib/model/MagicCardPrice';

export interface MagicCard {
    id: string;
    createdAt?: Date;
    name: string;
    mana_cost?: string;
    cmc: number;
    type_line: string;
    oracle_text: string;
    colors: string[];
    set_name: string;
    rarity: string;
    artist: string;
    tcgplayer_url?: string;
    cardmarket_url?: string;
    cardhoarder_url?: string;
    scryfall_url?: string;
    gatherer_url?: string;
    image_url?: string;
    magicCardPrices: MagicCardPrice[];
}
