"use client";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StockChartProps {
  data: { price: number }[];
  
}


export default function StockChart({ data }: StockChartProps) {
  return (
    <div style={{ width: 120, height: 50 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="linear"
            dataKey="price"
            stroke="#4caf50"
            strokeWidth={2}
            dot={false}
          />
        
        </LineChart>
        
      </ResponsiveContainer>
    </div>
  );
}
