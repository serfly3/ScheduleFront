"use client";
import React, { useContext } from "react";
import Style from "./page.module.css";
import ThemeContext from "@/context/ThemeContext"; // Путь к вашему контексту
import Link from "next/link";
import LastUpdate from "./Components/LastUpdate/LastUpdate";

export default function Home() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Получаем из контекста состояние и функцию для переключения темы
  return (
    <div className={`${Style["main"]} ${isDarkMode ? Style["dark"] : ""}`}>
      <LastUpdate></LastUpdate>
      <Link href={"sorting/class"}>
        <div className={`${Style["txt"]} ${isDarkMode ? Style["dark"] : ""}`}>
          Перейти к расписанию
        </div>
      </Link>
    </div>
  );
}
