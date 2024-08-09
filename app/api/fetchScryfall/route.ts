import { NextResponse } from "next/server";

import { fetchAndSafeScryfallCards } from "@/lib/scryfall/scryfallService";

export async function GET(request: Request) {
  const result = await fetchAndSafeScryfallCards();

  return NextResponse.json({ result });
}
