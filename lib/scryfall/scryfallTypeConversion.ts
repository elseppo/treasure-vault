export function scryfallCardToCard(card: any): any {
  return {
    id: card.id,
    name: card.name,
    mana_cost: card.mana_cost || null,
    cmc: card.cmc !== undefined ? card.cmc : 0,
    type_line: card.type_line || "",
    oracle_text: card.oracle_text || "",
    colors: card.colors || [],
    set_name: card.set_name || "",
    rarity: card.rarity || "",
    artist: card.artist || "",
    tcgplayer_url: card.purchase_uris?.tcgplayer || null,
    cardmarket_url: card.purchase_uris?.cardmarket || null,
    cardhoarder_url: card.purchase_uris?.cardhoarder || null,
    scryfall_url: card.scryfall_uri || null,
    gatherer_url: card.related_uris?.gatherer || null,
  };
}

export function scryfallCardToPrice(card: any): any {
  return {
    usd: card.prices.usd ? parseFloat(card.prices.usd) : null,
    usd_foil: card.prices.usd_foil ? parseFloat(card.prices.usd_foil) : null,
    usd_etched: card.prices.usd_etched
      ? parseFloat(card.prices.usd_etched)
      : null,
    eur: card.prices.eur ? parseFloat(card.prices.eur) : null,
    eur_foil: card.prices.eur_foil ? parseFloat(card.prices.eur_foil) : null,
    tix: card.prices.tix ? parseFloat(card.prices.tix) : null,
    magicCardId: card.id,
  };
}
