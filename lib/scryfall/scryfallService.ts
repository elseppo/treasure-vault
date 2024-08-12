import { PrismaClient } from "@prisma/client";

import {
  getOracleCardsFromScryfall,
  generateMagicCardPrismaDtoFromScryfallCard,
} from "@/lib/scryfall/scryfallHelper";

interface ScryfallUpdateError {
  upsertResult: any;
  error: any;
}

export const fetchAndSafeScryfallCards = async (fromLocal: boolean = false) => {
  console.log("fetchAndSafeScryfallCards");
  const cards: any[] = await getOracleCardsFromScryfall(fromLocal);
  const errors: ScryfallUpdateError[] = [];
  let totalUpsert: number = 0;

  for (const card of cards) {
    const cardWithPrice = generateMagicCardPrismaDtoFromScryfallCard(card);

    let latestResult;

    try {
      let prismaClient = new PrismaClient();

      latestResult = await prismaClient.magicCard.upsert({
        where: { id: cardWithPrice.id },
        update: {
          ...cardWithPrice,
        },
        create: {
          ...cardWithPrice,
        },
      });

      totalUpsert = totalUpsert + 1;
    } catch (e) {
      errors.push({ error: e, upsertResult: latestResult });
    }
  }

  return {
    errors: errors,
    totalUpsert: totalUpsert,
  };
};
