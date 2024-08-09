import { fetchAndSafeScryfallCards } from "@/lib/scryfall/scryfallService";

export const fetchScryfall = async (): Promise<any> =>
  fetchAndSafeScryfallCards();
