"use client";

import React, {useCallback, useEffect, useState} from "react";
import {MagicCard, MagicCardPrice} from "@prisma/client";

// @ts-ignore
import {Button, Card, CardBody, CardHeader, Image, Input, Pagination} from "@nextui-org/react";
import {debounce} from "lodash";

import {findMagicCardsByFilter, MagicCardResult,} from "@/lib/actions/CardAction";
import Chart from "@/components/chart";

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
            try {
                const result: MagicCardResult = await findMagicCardsByFilter(
                    nameInput,
                    pageNumber,
                    pageSize,
                );

                setCards(result.magicCards);
                setTotalCards(result.total);
            } catch (error) {
                console.log(error);
            }
        })();

        return () => {
            console.log("Destroyed CardList-Component");
        };
    }, [nameInput, pageNumber]); // Leeres Array als Abhängigkeit bedeutet, dass dieser Effekt nur einmal nach dem initialen Rendern ausgeführt wird

    function handlePageNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        const number = parseInt(e.target.value);

        if (!isNaN(number)) {
            setPageNumber(number);
        }
    }

    const handlePreviousPageClick = () => {
        setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
    };

    const handleNextPageClick = () => {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
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

                <div id="cards-container" className="flex flex-wrap justify-between">
                    {cards.map((card: MagicCard) => (
                        <Card key={card.id} className="py-4 w-1/2">

                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                <h4 className="font-bold text-large">{card.name}</h4>
                                <small className="text-small uppercase font-bold">
                                    {getLatestPrice(card)?.eur?.toString()} &euro;
                                </small>
                                <p className="text-tiny uppercase font-bold">{card.set_name}</p>
                            </CardHeader>

                            <CardBody className="overflow-visible py-2 flex flex-wrap">

                                <a className="w-fit"
                                   href={card?.cardmarket_url ?? ""}
                                   rel="noopener noreferrer"
                                   target="_blank"
                                >
                                    {" "}
                                    <Image
                                        alt="Card background"
                                        className="object-cover rounded-xl"
                                        src={card.image_url ?? ""}
                                        height={250}
                                    />
                                </a>
                                <div className="w-fit">
                                    <Chart prices={(card as any).MagicCardPrice}></Chart>
                                </div>
                            </CardBody>

                        </Card>
                    ))}
                </div>

                <Pagination
                    className="w-full flex-row justify-center"
                    size="lg"
                    loop
                    showControls
                    initialPage={1}
                    total={Math.ceil(totalCards / pageSize)}
                    onChange={handlePaginationOnClick}
                />
            </div>
        </>
    );
}
