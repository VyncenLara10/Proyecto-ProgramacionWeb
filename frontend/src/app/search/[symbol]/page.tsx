"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/menu/Layout";
import TB from "@/components/TB/TB"
import Style from "./accion.module.css"
import Grafico from "@/components/grafico/grafico"
import Button from "@/components/menu/Button"

export default function StockDetailPage() {

    const [selectedRange, setSelectedRange] = useState("1D");
    const [activeTab, setActiveTab] = useState<"comprar" | "vender">("comprar");
    const [form, setForm] = useState({
        symbol: "",
        cantidad: "",
        precio: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Acción: ${activeTab}`, form);
        //Envio de la api por la accion
    };

    //Info que se muestra
    const { symbol } = useParams(); //el valor de la accion
    const name = ("Nvidia INC.")
    const precio = (500)
    const cambio = (-2.54)
    const cambioporciento = (-0.34)
    const historydia = [
    { price: 2.2 },
    { price: 3.54 },
    { price: 4.15 },
    { price: 3.35 },
    { price: 4.62  },
    { price: 4.99 },
    { price: 4.87 },
    { price: 4.66 },
    { price: 5.07 },
    { price: 4.64 },
    { price: 4.27 },
    { price: 3.83 },
    { price: 3.9 },
    { price: 4.16},
    { price: 4.14 },
    { price: 4.06 },
    { price: 4.08 },
    { price: 4.38 },
    { price: 4.28},
    { price: 4.08 },
    { price: 3.91 },
    { price: 4.09 },
    { price: 4.00 },
    { price: 3.93},
    { price: 3.96 },
    { price: 4.14 },
    { price:4.01 },
    { price: 4.40 },
    { price: 4.30 },
    { price: 4.32 },
    { price: 4.02 },
    { price: 3.91},
    { price: 3.78 },
    { price: 4.05 },
    { price: 3.91},
    { price: 3.79 },
    { price: 3.87 },
    { price: 3.98 },
    { price: 3.64 },
    { price: 3.57},
    { price: 3.68 },
    { price: 3.54 },
    { price:3.65 },
    { price: 3.68 },
    { price: 3.62 },
    { price: 3.40}]

    const historyaño = [
    { price: 5.4 },
    { price: 6.12 },
    { price:7.42 },
    { price: 3.35 },
    { price: 4.62  },
    { price: 4.99 },
    { price: 4.87 },
    { price: 4.66 },
        { price: 5.07 },
    { price: 4.64 },
    { price: 4.27 },
    { price: 3.83 },
    { price: 3.9 },
    { price: 4.16},
    { price: 4.14 },
    { price: 4.06 },
    { price: 4.08 },
    { price: 4.38 },
    { price: 4.28},
        { price: 4.08 },
    { price: 3.91 },
    { price: 4.09 },
    { price: 4.00 },
    { price: 3.93},
    { price: 3.96 },
    { price: 4.14 },
    { price:4.01 },
        { price: 4.40 },
    { price: 4.30 },
    { price: 4.32 },
    { price: 4.02 },
    { price: 3.91},
    { price: 3.78 },
    { price: 4.05 },
    { price: 3.91},
        { price: 3.79 },
    { price: 3.87 },
    { price: 3.98 },
    { price: 3.64 },
    { price: 3.57},
    { price: 3.68 },
    { price: 3.54 },
    { price:3.65 },
        { price: 3.68 },
    { price: 3.62 },
    { price: 3.40}]

    //Este es para el cambio de grafica dependiendo del boton
    const [history, sethistory] = useState(historydia);
    useEffect(() => {
        if (selectedRange == "1D"){
        sethistory(historydia);
        }
        else if (selectedRange == "1A"){
        sethistory(historyaño);
        }
  }, [selectedRange]);


  useEffect(() => {
    if (!symbol) return;

  }, [symbol]);

  return (
    <Layout>
        <TB/>
            <div className={Style.container}>
                <div className={Style.informacion}>
                    <div className={Style.datos}>
                        <div className={Style.dato}>
                            <p style={{ fontWeight: "bold" }}>{symbol}</p>
                            <p>{name}</p>
                        </div>
                        <p className={Style.dato}>${precio}</p>
                        <div className={Style.dato}>
                            <p style={{ color: cambio >= 0 ? "green" : "red" }}>{cambio}</p>
                            <p style={{ color: cambio >= 0 ? "green" : "red" }}>{cambioporciento}%</p>
                        </div>

                    </div>

                    <div className={Style.containergraf}>
                        <Grafico data={history}/>
                    </div>
                    <div className={Style.containerb}>
                        <button
                            className={selectedRange === "1D" ? Style.bbtonclick : Style.bbton}
                            onClick={() => setSelectedRange("1D")}
                        >1D</button>
                        <button
                            className={selectedRange === "1S" ? Style.bbtonclick : Style.bbton}
                            onClick={() => setSelectedRange("1S")}
                        >1S</button>
                        <button
                            className={selectedRange === "1M" ? Style.bbtonclick : Style.bbton}
                            onClick={() => setSelectedRange("1M")}
                        >1M</button>
                        <button
                            className={selectedRange === "1A" ? Style.bbtonclick : Style.bbton}
                            onClick={() => setSelectedRange("1A")}
                        >1A</button>

                    </div>
                </div>
                

                <div className={Style.containercard}>
                <div className={Style.card}>
                    
                    <div className={Style.tabs}>
                        <button
                        className={`${Style.tab} ${activeTab === "comprar" ? Style.active : ""}`}
                        onClick={() => setActiveTab("comprar")}
                        >
                        Comprar
                        </button>
                        <button
                        className={`${Style.tab} ${activeTab === "vender" ? Style.active : ""}`}
                        onClick={() => setActiveTab("vender")}
                        >
                        Vender
                        </button>
                    </div>

                    
                    <form className={Style.form} onSubmit={handleSubmit}>
                        <label>
                        Símbolo:
                        <input
                            type="text"
                            name="symbol"
                            value={form.symbol}
                            onChange={handleChange}
                            placeholder="Ej: MSFT"
                            required
                        />
                        </label>

                        <label>
                        Cantidad:
                        <input
                            type="number"
                            name="cantidad"
                            value={form.cantidad}
                            onChange={handleChange}
                            placeholder="Ej: 10"
                            required
                        />
                        </label>

                        {activeTab === "comprar" ? (
                        <label>
                            Precio por acción (USD):
                            <input
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={handleChange}
                            placeholder="Ej: 315.50"
                            step="0.01"
                            required
                            />
                        </label>
                        ) : (
                        <label>
                            Precio actual (solo lectura):
                            <input type="number" value={form.precio} readOnly placeholder="315.50" />
                        </label>
                        )}

                        <Button variant="secondary" type="submit">
                        Continuar
                        </Button>
                    </form>
                </div>
                </div>
            </div>

      
      
    </Layout>
  );
}
