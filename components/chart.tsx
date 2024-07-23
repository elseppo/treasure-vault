import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import { MagicCardPrice } from "@prisma/client";

interface ChartProps {
  prices: MagicCardPrice[];
}

export default function Chart({ prices: prices }: ChartProps) {
  return (
    <div>
      <LineChart
        data={prices}
        height={200}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        width={400}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="createdAt" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          activeDot={{ r: 8 }}
          dataKey="eur"
          stroke="#338ef7"
          type="monotone"
        />
        <Line dataKey="eur_foil" stroke="#cce3fd" type="monotone" />
        <Line dataKey="usd_foil" stroke="#9353d3" type="monotone" />
        <Line dataKey="usd_foil" stroke="#e4d4f4" type="monotone" />
      </LineChart>
    </div>
  );
}
