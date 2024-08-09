import { MagicCard } from "@prisma/client";

export interface MagicCardResult {
  magicCards: MagicCard[];
  total: number;
}
