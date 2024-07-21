export async function fetchScryfallAllCards() {
  let cards: any[] = [];

  try {
    const axios: any = null;

    console.log("Fetching Bulk Data from Scryfall");
    const bulkData = await axios.get("https://api.scryfall.com/bulk-data");
    const downloadUri = bulkData.data.data.find(
      (o: any) => o.type == "oracle_cards",
    ).download_uri;

    console.log("Fetching Cards From Scryfall from", downloadUri);
    const cardsResponse = await axios.get(downloadUri);

    cards = cardsResponse.data;
    console.log("Fetching Finished");
  } catch (error) {
    console.error(error);

    return error;
  }

  return cards;
}
