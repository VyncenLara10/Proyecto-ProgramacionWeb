"use client"; 
import React from "react";
import Layout from "@/components/menu/Layout";
import Button from "@/components/menu/Button";
import styles from "./home.module.css"; 
import TB from "@/components/TB/TB"


export default function HomePage() {
  return (
    
    <Layout>
      <TB />
      
        <div className={styles.container}>
          <div className={styles.container_info}> 
            <div className={styles.container_text}>
              <h1 className={styles.h1}>Empieza a Invertir</h1>
              <p className={styles.p}>Agrega fondos para comenzar a comprar acciones.</p>
              <Button variant="primary" >Agregar Fondos</Button>
            </div>
            <img className={styles.imagen} src="/Images/Invierte.png" alt="imagen" />
          </div>   

          <div className={styles.container_info}> 
            <img className={styles.imagen} src="/Images/InvAmigos.png" alt="imagen" />
            <div className={styles.container_text}>
              <h1 className={styles.h1}>Invita Amigos</h1>
              <p className={styles.p}>Por cada amigo que se registre con tu código, se te regalara $5.</p>
              <Button variant="primary" >Invita Amigos</Button>
            </div>
            
          </div>

          <div className={styles.container_info}> 
            <div className={styles.container_text}>
              <h1 className={styles.h1}>Revisa tu Portafolio</h1>
              <p className={styles.p}>Revisa el Total de tus Activos y el Total de tu Dinero, además de tus Activos Pendientes.</p>
              <Button variant="primary" >Ver Portafolio</Button>
            </div>
            <img className={styles.imagen} src="/Images/Portafolio.png" alt="imagen" />
          </div> 
            

        </div>
     
    </Layout>
  );
}


