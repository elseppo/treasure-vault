import { updateScryfallPrices } from "@/lib/actions/CardAction";

export async function GET(request: Request) {
  return await updateScryfallPrices();
}
