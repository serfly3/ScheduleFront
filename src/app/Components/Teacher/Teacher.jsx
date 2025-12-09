'use client';
import { useContext } from "react";
import Link from "next/link"; // Для роутинга
import Style from "./Teacher.module.css"; // Стиль для компонента
import ThemeContext from "@/context/ThemeContext"; // Контекст для темной темы

export const Teacher = ({ name, index }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`${Style["container"]} ${isDarkMode ? Style["dark"] : ""}`}>
      <Link href={`teacher/${name}`} key={name}>
        <p className={`${Style["name"]} ${isDarkMode ? Style["dark"] : ""}`}>
          {name}
        </p>
      </Link>
    </div>
  );
};
