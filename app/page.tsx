"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MagicCard, MagicCardPrice } from "@prisma/client";
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Input,
  Pagination,
} from "@nextui-org/react";
import { debounce } from "lodash";
import { Button } from "@nextui-org/button";

import { getMagicCards, MagicCardResult } from "@/lib/card";
import Chart from "@/components/chart";
import { fetchScryfall } from "@/lib/scryfall/scryfallAction";

export default function CardList() {
  const pageSize = 12;
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const [totalCards, setTotalCards] = useState(0);

  // kein async methode im effect
  useEffect(() => {
    // Anonyme Asynchrone Funktion zum Abrufen der Daten
    // wird direkt gecalled durch die geile () am ende
    (async () => {
      const result: MagicCardResult = await getMagicCards(
        nameInput,
        pageNumber,
        pageSize,
      );

      setCards(result.magicCards);
      setTotalCards(result.total);
    })();
  }, [nameInput, pageNumber]); // Leeres Array als Abhängigkeit bedeutet, dass dieser Effekt nur einmal nach dem initialen Rendern ausgeführt wird

  const handleFetchClick = async () => {
    await fetchScryfall();
  };

  const handleFilterStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const handleFilterStringChangeDebounced = useCallback(
    debounce(handleFilterStringChange, 500),
    [],
  );

  const handlePaginationOnClick = (currentPage: number) => {
    setPageNumber(currentPage);
  };

  const getLatestPrice = (card: any): MagicCardPrice => {
    if (card.MagicCardPrice && Array.isArray(card.MagicCardPrice)) {
      card.MagicCardPrice.sort(
        (a: MagicCardPrice, b: MagicCardPrice) =>
          // @ts-ignore
          new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return card.MagicCardPrice[0];
  };

  return (
    <>
      <div>
        <Button onClick={handleFetchClick}> Fetch ! </Button>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input
            label="Suche"
            placeholder="Treasure Vault ..."
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFilterStringChangeDebounced(e)
            }
          />
        </div>

        <div className="flex flex-wrap justify-between" id="cards-container">
          {cards.map((card: MagicCard) => (
            <Card key={card.id} className="py-4 w-fit">
              <CardHeader className="pb-0 pt-2 flex-col items-start">
                <h4 className="font-bold text-large">{card.name}</h4>
                <small className="text-small uppercase font-bold">
                  {getLatestPrice(card)?.eur?.toString()} &euro;
                </small>
                <p className="text-tiny uppercase font-bold">{card.set_name}</p>
              </CardHeader>

              <CardBody className="overflow-visible py-2 pt-2">
                <div className="flex flex-wrap align-bottom justify-around">
                  <a
                    href={card?.cardmarket_url ?? ""}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl"
                      height={250}
                      src={card.image_url ?? ""}
                    />
                  </a>
                  <div>
                    <Chart prices={(card as any).MagicCardPrice} />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <Pagination
          loop
          showControls
          className="w-full flex-row justify-center"
          initialPage={1}
          size="lg"
          total={Math.ceil(totalCards / pageSize)}
          onChange={handlePaginationOnClick}
        />
      </div>
    </>
  );
}
