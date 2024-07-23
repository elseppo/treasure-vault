// prisma/seed.ts

import fs from "node:fs";

import { PrismaClient } from "@prisma/client";

import {
  scryfallCardToCard,
  scryfallCardToPrice,
} from "../lib/scryfall/scryfallHelper";

const JSONStream = require("JSONStream");

const prisma = new PrismaClient();

async function main() {
  console.error("APPLYING PRISMA SEED");
  const filePath = "./prisma/seed-data.json";
  const jsonStream = fs.createReadStream(filePath, { encoding: "utf-8" });

  jsonStream
    .pipe(JSONStream.parse("*"))
    .on("data", async (card: any) => {
      await processCard(card);
    })
    .on("end", async () => {
      console.log("Finished processing");
    })
    .on("error", (err: any) => {
      console.error("Error reading the stream:", err);
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.error("APPLIED PRISMA SEED");
    await prisma.$disconnect();
  });

async function processCard(card: any) {
  try {
    const convertedCard = scryfallCardToCard(card);
    const convertedPrice = scryfallCardToPrice(card);
    // remove magicCardId Property as it is automatically added during create
    // and having it in the objects will result in an error
    const { magicCardId, ...priceWithoutMagicCardId } = convertedPrice;

    const cardToSave = {
      ...convertedCard,
      MagicCardPrice: {
        create: [priceWithoutMagicCardId],
      },
    };

    await prisma.magicCard.create({ data: cardToSave });
  } catch (e) {
    console.error(`Error processing card ${card.id}:`, e);
  }
}
