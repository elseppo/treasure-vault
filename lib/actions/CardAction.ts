"use server";

import { MagicCard, PrismaClient } from "@prisma/client";

import {
  getOracleCardsFromScryfall,
  scryfallCardToPrice,
} from "@/lib/scryfall/scryfallHelper";

export interface MagicCardResult {
  magicCards: MagicCard[];
  total: number;
}

export const findMagicCardsByFilter = async (
  searchString: string,
  pageNumber: number,
  pageSize: number,
): Promise<MagicCardResult> => {
  let prismaClient = new PrismaClient();

  const total = await prismaClient.magicCard.count({
    where: {
      name: {
        contains: searchString,
      },
    },
  });

  const magicCards = await prismaClient?.magicCard.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      name: {
        contains: searchString,
      },
    },
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    include: { MagicCardPrice: true },
  });

  return { magicCards, total };
};

export const updateScryfallPrices = async () => {
  let result;

  try {
    let pricesToSafe: any[] = [];

    const cards = await getOracleCardsFromScryfall();

    for (let i = 0; i < cards.length; i++) {
      const price = scryfallCardToPrice(cards[i]);

      pricesToSafe.push(price);
    }

    result = await new PrismaClient().magicCardPrice.createMany({
      data: pricesToSafe,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(error);

    return error;
  }
  console.log("result", result);

  return result;
};
