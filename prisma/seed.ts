// prisma/seed.ts

import fs from "node:fs";

import { PrismaClient } from "@prisma/client";

const JSONStream = require("JSONStream");

const prisma = new PrismaClient();

async function main() {
  const filePath = "scryfall-data/oracle-cards.json";
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
    await prisma.$disconnect();
  });

async function processCard(card: any) {
  try {
    const priceToSave = {
      usd: card.prices.usd ? parseFloat(card.prices.usd) : null,
      usd_foil: card.prices.usd_foil ? parseFloat(card.prices.usd_foil) : null,
      usd_etched: card.prices.usd_etched
        ? parseFloat(card.prices.usd_etched)
        : null,
      eur: card.prices.eur ? parseFloat(card.prices.eur) : null,
      eur_foil: card.prices.eur_foil ? parseFloat(card.prices.eur_foil) : null,
      tix: card.prices.tix ? parseFloat(card.prices.tix) : null,
      //magicCardId: card.id,
    };

    const cardToSave = {
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
      MagicCardPrice: {
        create: [priceToSave],
      },
      image_url: card.image_uris?.normal ?? "",
    };

    await prisma.magicCard.create({ data: cardToSave });
  } catch (e) {
    console.error(`Error processing card ${card.id}:`, e);
  }
}
