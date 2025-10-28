"use client";
import React, { useState, useMemo, useEffect } from 'react';
import StockTable from "@/components/Action_Table/table";
import Layout from "@/components/menu/Layout";
import Buscador from "@/components/TB/Buscador"
import TB from "@/components/TB/TB"
import Button from "@/components/menu/Button"
import style from "./search.module.css"

const initialStocks = [ {
   
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
      },
    {
        symbol: "ALA",
        name: "Alabama",
        price: 320.4,
        change: -1.12,
        changePercent: 0.35,
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
      },
    {
        symbol: "XD",
        name: "SAUSE",
        price: 320.4,
        change: -1.12,
        changePercent: 0.35,
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
      },
    {
        symbol: "FILO",
        name: "del mañana",
        price: 400.4,
        change: 1.12,
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

const filterStock = [{ //este es el de busqueda
        symbol: "FILO",
        name: "del mañana",
        price: 400.4,
        change: 1.12,
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
    ]
}]

const filtradoSalud = [{ //este es el de filtrado
        symbol: "Su",
        name: "DRDE",
        price: 400.4,
        change: 1.12,
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
    ]
}]

export default function DashboardPage() {
    const [filteropen, setfilteropen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("⛔Sin Filtro");
    const [stocks, setStocks] = useState(initialStocks);


   const categorias = [
    { tipo: "⛔Sin Filtro" },
    { tipo: "🔝10Top" },
    { tipo: "🧑‍⚕️Salud" },
  ]; 

    const handleFilterSelect = (tipo: string) => {
      setSelectedFilter(tipo);
      setfilteropen(false);

      switch (tipo) {
        case "🔝10Top":
          setStocks(filtradoSalud);
          break;
        case "🧑‍⚕️Salud":
          setStocks(filtradoSalud);
          break;
        case "⛔Sin Filtro":
        default:
          setStocks(initialStocks);
          break;
      }
    };

    const handleSearchSubmit = (term: string) => {
      setSearchTerm(term)
    
    };

    useEffect(() => {
      const term = searchTerm.trim().toLowerCase();
      console.log("Buscando:", term);

      if (term === "") {
        // Si no hay nada en el input
        setStocks(initialStocks);
        return;
      }
      // cuando haya texto, muestra filterStock este es el del filtro aplicado
      setStocks(filterStock);

    }, [searchTerm]); //si el searchTerm cambia, aplica este useEffect
  

  

  return (
    <Layout>
      <TB />
        <div>
          <Buscador className={style.searchBigBox} onSearch={handleSearchSubmit}  />
          <div className={style.twobotons}>
            <div className={style.filtrado}>
              <Button variant='primary' onClick={() => setfilteropen((prev) => !prev)}>Filtrar Por Categoria</Button>
              {filteropen && (
              <div className={style.filtro}>
                <nav className={style.nav}>
                  {categorias.map((cat) => (
                    <button 
                      key={cat.tipo}
                      onClick={() => handleFilterSelect(cat.tipo)}
                      className={style.activeFilter 
                      }
                    >
                      {cat.tipo}
                    </button>
                  ))}
                </nav>
              </div>
              )}
              </div>

              <div className={style.filtrado}>
                <Button variant='primary'>Filtrar Por Cambio</Button>
              </div>
          </div>
          <StockTable stocks={stocks}/>
        </div>
        
    </Layout>
  );
}
