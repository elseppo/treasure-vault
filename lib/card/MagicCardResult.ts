import { MagicCard } from "@prisma/client";

interface MagicCardResult {
  magicCards: MagicCard[];
  total: number;
}

export type { MagicCardResult };
