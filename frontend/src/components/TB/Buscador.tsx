"use client";
import React, { useState } from "react";
import Button from "@/components/menu/Button";
import styles from "./TB.module.css";


interface BuscarProps {
    onSearch: (searchTerm: string) => void;
    className?: string;
}

export default function Buscar({ onSearch, className}: BuscarProps) {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        onSearch(query.trim());

    };

    return(
        <form onSubmit={handleSearch} className={`${styles.searchBox} ${className || ""}`}>
            <input
                type="text"
                placeholder="Buscar Empresa o ETF"
                value={query}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);
                    if (value.trim() === "") {
                        onSearch(""); 
                    }
                    }}


            />
            <Button variant="secondary" type="submit">Buscar</Button>
        </form>
    );
}