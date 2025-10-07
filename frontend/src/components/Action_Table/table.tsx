"use client";
import React, { useState, useMemo } from "react"; 
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import StockChart from "../grafico/grafico";


type Stock = {
    imagen: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    history: { price: number }[];
};

interface StockTableProps {
  stocks: Stock[];
}

export default function StockTable({ stocks }: StockTableProps) {
    const router = useRouter();

    const click_fila = (stock: Stock) => {
        const path = `/search/${stock.symbol}`
        router.push(path)}

    return (
        <div className={styles.tableContainer}>
            <table className={styles.tables}>
                <tbody className={styles.tablabody}>
                    <tr>
                        <th>Simbolo</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cambio</th>
                        <th>Cambio %</th>
                        <th>Volumen</th>
                        <th></th>
                    </tr>
                    {stocks.map((stock) => (
                    
                        <tr className={styles.datos} key={stock.symbol} onClick={() => click_fila(stock)} style={{ cursor: 'pointer' }}>
                            <td className={styles.simboloimg}><img src={stock.imagen} alt="" />{stock.symbol}
                            </td>
                            <td>{stock.name}</td>
                            <td>{stock.price}</td>
                            <td>{stock.change}</td>
                            <td>{stock.changePercent}%</td>
                            <td>{stock.volume}</td>
                            <td><StockChart data={stock.history}/></td>
                        </tr>
                    
                    ))}
                </tbody>
                
            </table>
        </div>

        
    );
}
