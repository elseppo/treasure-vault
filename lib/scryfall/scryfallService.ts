import { PrismaClient } from "@prisma/client";

import {
  getOracleCardsFromScryfall,
  scryfallCardToCard,
  scryfallCardToPrice,
} from "@/lib/scryfall/scryfallHelper";

export const fetchAndSafeScryfallCards = async (fromLocal: boolean = false) => {
  let result;

  const cards: any[] = await getOracleCardsFromScryfall(fromLocal);

  const updateResult = {
    errors: [],
    totalUpdates: 0,
  };

  for (const card of cards) {
    const cardToSave = scryfallCardToCard(card);
    const priceToSave = scryfallCardToPrice(card);

    try {
      await new PrismaClient().magicCard.upsert({
        where: { id: cardToSave.id },
        update: {
          name: cardToSave.name,
          mana_cost: cardToSave.mana_cost,
          cmc: cardToSave.cmc,
          type_line: cardToSave.type_line,
          oracle_text: cardToSave.oracle_text,
          colors: cardToSave.colors,
          set_name: cardToSave.set_name,
          rarity: cardToSave.rarity,
          artist: cardToSave.artist,
          tcgplayer_url: cardToSave.tcgplayer_url,
          cardmarket_url: cardToSave.cardmarket_url,
          cardhoarder_url: cardToSave.cardhoarder_url,
          scryfall_url: cardToSave.scryfall_url,
          gatherer_url: cardToSave.gatherer_url,
          image_url: cardToSave.image_url,
          MagicCardPrice: {
            upsert: {
              where: { id: priceToSave.id ?? -1 }, // id ist optional
              update: {
                usd: priceToSave.usd,
                usd_foil: priceToSave.usd_foil,
                usd_etched: priceToSave.usd_etched,
                eur: priceToSave.eur,
                eur_foil: priceToSave.eur_foil,
                tix: priceToSave.tix,
              },
              create: {
                usd: priceToSave.usd,
                usd_foil: priceToSave.usd_foil,
                usd_etched: priceToSave.usd_etched,
                eur: priceToSave.eur,
                eur_foil: priceToSave.eur_foil,
                tix: priceToSave.tix,
              },
            },
          },
        },
        create: {
          ...cardToSave,
          MagicCardPrice: {
            create: priceToSave,
          },
        },
      });

      updateResult.totalUpdates = updateResult.totalUpdates + 1;
    } catch (e) {
      updateResult.errors.push(e);
      console.error(e);
    }
  }

  return result;
};
