"use client";
import React, { useState, useMemo } from 'react';
import StockTable from "@/components/Action_Table/table";
import Layout from "@/components/menu/Layout";
import Buscador from "@/components/TB/Buscador"
import TB from "@/components/TB/TB"
import Button from "@/components/menu/Button"
import style from "./search.module.css"

const initialStocks = [ {
        imagen: "Images/apl.png",
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 225.35,
        change: 2.15,
        changePercent: 0.96,
        volume: "32.1M",
        history: [
      { price: 240.5 },
      { price: 210.8 },
      { price: 200.0 },
      { price: 280.6 },
      { price: 300.35 },
      { price: 350.35 },
      { price: 500.35 }
    ],
      },
      {
        imagen: "Images/apl.png",
        symbol: "MSFT",
        name: "Microsoft Corp.",
        price: 320.4,
        change: -1.12,
        changePercent: -0.35,
        volume: "25.7M",
        history: [
      { price: 220.5 },
      { price: 221.8 },
      { price: 400.0 },
      { price: 232.6 },
      { price: -100.35 },
      { price: 300.35 },
      { price: 345.35 },
      { price: 390.35 }
    ],
      }];

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (term: string) => {
        setSearchTerm(term);
    };

    const filteredStocks = useMemo(() => {
      const term = searchTerm.trim().toLowerCase();

      if (term === "") {
        return initialStocks;
      }

      return initialStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(term) ||
        stock.name.toLowerCase().includes(term)
      );
    }, [searchTerm]);

  

  return (
    <Layout>
      <TB />
        <div>
          <Buscador className={style.searchBigBox} onSearch={handleSearchSubmit} />
          <div className={style.filtrado}>
            <Button variant='primary'>Filtrar Por </Button>
            <Button variant='primary'>Filtrar Por</Button>
          </div>
          <StockTable stocks={filteredStocks} />
        </div>
    </Layout>
  );
}
