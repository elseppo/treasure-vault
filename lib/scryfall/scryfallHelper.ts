import fs from "node:fs";
import path from "path";

import axios from "axios";
import { MagicCard } from "@prisma/client";

export function scryfallCardToCardWithPriceDto(card: any): any {
  const convertedCard = scryfallCardToCard(card);
  const convertedPrice = scryfallCardToPrice(card);
  // remove magicCardId Property as it is automatically added during create
  // and having it in the objects will result in an error
  const { magicCardId, ...priceWithoutMagicCardId } = convertedPrice;

  return {
    ...convertedCard,
    MagicCardPrice: {
      create: [priceWithoutMagicCardId],
    },
  };
}

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
    magicCardId: card.id,
  };
}

export async function getOracleCardsFromScryfall(fromLocal: boolean = false) {
  let cards;

  if (fromLocal) {
    cards = getOracleCardsFromLocal();
  }

  if (!fromLocal) {
    console.log("Fetching Bulk Data from Scryfall");

    const bulkData = await axios.get("https://api.scryfall.com/bulk-data");

    const downloadUri = bulkData.data.data.find(
      (o: any) => o.type == "oracle_cards",
    ).download_uri;

    console.log("Fetching Cards From Scryfall from", downloadUri);
    const cardsResponse = await axios.get(downloadUri);

    cards = cardsResponse.data;
  }

  console.log("Fetching Finished, fetched total of: ", cards.length);

  return cards;
}

export function getOracleCardsFromLocal() {
  console.log("Fetching Bulk Data from LOCAL ");
  const json = fs.readFileSync(
    path.resolve("scryfall-data/cards.json"),
    "utf-8",
  );
  const cards: MagicCard[] = JSON.parse(json);

  return cards;
}
