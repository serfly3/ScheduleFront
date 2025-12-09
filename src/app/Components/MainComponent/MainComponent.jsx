"use client";
import { Header } from "../Header/Header";
import './MainComponent.module.css'
import ThemeContext from "@/context/ThemeContext"; // Путь к вашему контексту
import { useContext } from "react";
import { Footer } from "../Footer/Footer";


export const MainComponent = ({ children }) => {
    const { isDarkMode } = useContext(ThemeContext); // Используем контекст для получения темы

  
  return (
    <html lang="ru">
      <body className={`main ${isDarkMode ? "dark" : ""}`}>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
};
