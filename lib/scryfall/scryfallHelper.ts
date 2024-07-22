import axios from "axios";
import fs from "node:fs";
import {MagicCard} from "@prisma/client";
import path from "path";

export function scryfallCardToCard(card: any): any {
    return {
        id: card.id,
        name: card.name,
        mana_cost: card.mana_cost || null,
        cmc: card.cmc !== undefined ? card.cmc : 0,
        type_line: card.type_line || "",
        oracle_text: card.oracle_text || "",
        colors: card.colors || [],
        set_name: card.set_name || "",
        rarity: card.rarity || "",
        artist: card.artist || "",
        tcgplayer_url: card.purchase_uris?.tcgplayer || null,
        cardmarket_url: card.purchase_uris?.cardmarket || null,
        cardhoarder_url: card.purchase_uris?.cardhoarder || null,
        scryfall_url: card.scryfall_uri || null,
        gatherer_url: card.related_uris?.gatherer || null,
        image_url: card.image_uris?.normal ?? "",
    };
}

export function scryfallCardToPrice(card: any): any {
    return {
        usd: card.prices.usd ? parseFloat(card.prices.usd) : null,
        usd_foil: card.prices.usd_foil ? parseFloat(card.prices.usd_foil) : null,
        usd_etched: card.prices.usd_etched
            ? parseFloat(card.prices.usd_etched)
            : null,
        eur: card.prices.eur ? parseFloat(card.prices.eur) : null,
        eur_foil: card.prices.eur_foil ? parseFloat(card.prices.eur_foil) : null,
        tix: card.prices.tix ? parseFloat(card.prices.tix) : null,
        magicCardId: card.id
    };
}

export async function getOracleCardsFromScryfall() {
    console.log("Fetching Bulk Data from Scryfall");
    const bulkData = await axios.get("https://api.scryfall.com/bulk-data");
    console.log(bulkData);

    const downloadUri = bulkData.data.data.find(
        (o: any) => o.type == "oracle_cards",
    ).download_uri;

    console.log("Fetching Cards From Scryfall from", downloadUri);
    const cardsResponse = await axios.get(downloadUri);

    const cards = cardsResponse.data;
    console.log(cardsResponse);

    return cards;
}

export function getOracleCardsFromLocal() {
    console.log("Fetching Bulk Data from LOCAL ");
    const json = fs.readFileSync(path.resolve('scryfall-data/oracle-cards.json'), 'utf-8');
    const cards: MagicCard[] = JSON.parse(json);
    return cards;
}