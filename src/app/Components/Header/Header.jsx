"use client";
import React, { useContext, useState, useEffect } from "react";
import Style from "./Header.module.css";
import Link from "next/link";
import ThemeContext from "@/context/ThemeContext"; // Путь к вашему контексту

export const Header = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Получаем из контекста состояние и функцию для переключения темы
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Обновляем дату и время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Обновляем каждую секунду

    return () => clearInterval(timer); // Очистка таймера при размонтировании
  }, []);

  // Функция для получения последней даты изменения
  const setLastModifiedDate = (date) => {
    lastModified = date; // Присваиваем значение
  };

  // Форматируем дату и время
  const formatDate = (date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <header className={`${Style["header"]} ${isDarkMode ? Style["dark"] : ""}`}>
      <div className={Style["header_top"]}>
        <div className={`${Style["cont"]} ${isDarkMode ? Style["dark"] : ""}`}>
          <Link href="/" className={Style["logo"]}>
            <img src="/logo.png" alt="Логотип" />
          </Link>
          <p className={`${Style["main_txt"]} ${isDarkMode ? Style["dark"] : ""}`}>
            Расписание занятий
          </p>
        </div>
        <img
          src={isDarkMode ? "/sun.png" : "/moon.png"} // В зависимости от темы меняем изображение
          alt="тема"
          className={`${Style["theme"]} ${isDarkMode ? Style["dark"] : ""}`}
          onClick={toggleTheme} // При клике переключаем тему
        />
      </div>
    </header>
  );
};

// Экспортируем функцию для установки даты последнего изменения
export const updateLastModified = (date) => {
  lastModified = date;
};

export default Header;
