"use client";
import React, { useContext } from "react";
import "./NotFound.css";
import Link from "next/link";
import ThemeContext from "@/context/ThemeContext"; // Путь к вашему контексту

export const NotFound = ({ typePage }) => {
  const { isDarkMode } = useContext(ThemeContext); // Используем контекст для получения темы

  // Условие для отображения текста в зависимости от typePage
  const message = typePage === "расписание" 
    ? "Расписание не найдено ☹️" 
    : typePage === "страница" 
    ? "Страница не найдена ☹️"
    : "Не найдено ☹️"; // Можно добавить стандартное сообщение, если typePage не совпадает

  return (
    <div className={`container ${isDarkMode ? "dark" : ""}`}>
      <h1 className={`txt ${isDarkMode ? "dark" : ""}`}>
        {message}
      </h1>
      <img
        src="/error.gif"
        className={`imglalala ${isDarkMode ? "dark" : ""}`}
        alt="ничего не найдено"
      />
      <Link href={"/"} className={`txta ${isDarkMode ? "dark" : ""}`}>
        <h1 className={`txtaa ${isDarkMode ? "dark" : ""}`}>На главную</h1>
      </Link>

      <div></div>
    </div>
  );
};
