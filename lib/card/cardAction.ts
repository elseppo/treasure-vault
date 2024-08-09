import {
  findMagicCardsByFilter,
  MagicCardResult,
} from "@/lib/card/cardService";

export const getMagicCards = async (
  searchString: string,
  pageNumber: number,
  pageSize: number,
): Promise<MagicCardResult> =>
  findMagicCardsByFilter(searchString, pageNumber, pageSize);
