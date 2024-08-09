import { findMagicCardsByFilter } from "@/lib/card/cardService";
import { MagicCardResult } from "@/lib/card/MagicCardResult";

export const getMagicCards = async (
  searchString: string,
  pageNumber: number,
  pageSize: number,
): Promise<MagicCardResult> =>
  findMagicCardsByFilter(searchString, pageNumber, pageSize);
