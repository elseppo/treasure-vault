"use server";

import {MagicCard, MagicCardPrice, PrismaClient} from "@prisma/client";
import axios from "axios";
import {getOracleCardsFromLocal, getOracleCardsFromScryfall, scryfallCardToPrice} from "@/lib/scryfall/scryfallHelper";
import path from "path";
import {number} from "prop-types";

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
        include: {MagicCardPrice: true},
    });

    return {magicCards, total};
};

export const saveMagicCardPrices = async (prices: MagicCardPrice[]) => {
    return new PrismaClient().magicCardPrice.createMany({data: prices, skipDuplicates: true});
}

export const saveMagicCardPrice = async (price: MagicCardPrice) => {
    return new PrismaClient().magicCardPrice.create({data: price});
}

export const updateScryfallPrices = async () => {

    try {
        let pricesToSafe: any[] = [];

        const cards = await getOracleCardsFromScryfall();
        // const cards = getOracleCardsFromLocal();
        console.log("Fetching Finished, fetched total of: ", cards.length);
        console.log('Saving to database.');

        for (let i = 0; i < cards.length; i++) {
            const price = scryfallCardToPrice(cards[i]);
            pricesToSafe.push(price);
        }

        const result = await saveMagicCardPrices(pricesToSafe);
        console.log('Saved to database:', result);

    } catch (error) {
        console.error(error);
        return error;
    }
}