"use server";

import { MagicCard, PrismaClient } from "@prisma/client";

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
