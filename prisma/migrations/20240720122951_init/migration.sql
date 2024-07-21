-- CreateTable
CREATE TABLE "MagicCard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mana_cost" TEXT,
    "cmc" DOUBLE PRECISION NOT NULL,
    "type_line" TEXT NOT NULL,
    "oracle_text" TEXT NOT NULL,
    "colors" TEXT[],
    "set_name" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "tcgplayer_url" TEXT,
    "cardmarket_url" TEXT,
    "cardhoarder_url" TEXT,
    "scryfall_url" TEXT,
    "gatherer_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicCardPrice" (
    "id" SERIAL NOT NULL,
    "usd" DECIMAL(10,2),
    "usd_foil" DECIMAL(10,2),
    "usd_etched" DECIMAL(10,2),
    "eur" DECIMAL(10,2),
    "eur_foil" DECIMAL(10,2),
    "tix" DECIMAL(10,2),
    "magicCardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicCardPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MagicCardPrice" ADD CONSTRAINT "MagicCardPrice_magicCardId_fkey" FOREIGN KEY ("magicCardId") REFERENCES "MagicCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
