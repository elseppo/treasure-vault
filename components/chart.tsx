import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts';
import React from "react";
import {MagicCardPrice} from "@prisma/client";


interface ChartProps {
    prices: MagicCardPrice[]
}

export default function Chart({prices: prices}: ChartProps) {

    return (
        <div>
            <LineChart
                width={400}
                height={200}
                data={prices}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="createdAt"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="eur" stroke="#8884d8" activeDot={{r: 8}}/>
                <Line type="monotone" dataKey="eur_foil" stroke="#82ca9d"/>
            </LineChart>
        </div>
    );
}
