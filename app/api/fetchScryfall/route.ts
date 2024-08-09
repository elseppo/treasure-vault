import { NextResponse } from "next/server";

import { fetchAndSafeScryfallCards } from "@/lib/scryfall/scryfallService";

export async function POST(request: Request) {
  const body = await request.json();
  const doFetch: boolean = body.doFetch;

  if (doFetch == true) {
    return NextResponse.json(await fetchAndSafeScryfallCards());
  }

  return NextResponse.json({});
}
