"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeContext from "@/context/ThemeContext";
import "./Dropdown.css";

export const List = ({ onToggle }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Класс");
  const router = useRouter();

  // UseEffect to set the initial selected option based on the current path
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("class")) {
      setSelectedOption("Класс");
    } else if (currentPath.includes("teacher")) {
      setSelectedOption("Учитель");
    }
  }, [router.asPath]); // Re-run when the path changes

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (onToggle) {
      onToggle(newIsOpen);
    }
  };

  const handleSelection = (option, link) => {
    setSelectedOption(option);
    setIsOpen(false); // Закрываем выпадающий список при выборе
    if (onToggle) {
      onToggle(false); // Вызываем onToggle, чтобы уведомить родительский компонент о закрытии
    }
    router.push(link); // Перенаправляем на выбранную ссылку
  };

  return (
    <div className={`dropdown-container ${isOpen ? "expanded" : ""} ${isDarkMode ? "dark" : ""}`}>
      <button 
        className={`dropdown-btn ${isDarkMode ? "dark" : ""} ${isOpen ? "open" : ""}`} 
        onClick={toggleDropdown}
      >
        {selectedOption}
        <span className={`arrow ${isOpen ? "open" : ""}`}>
          <img src={isDarkMode? "/sDark.png":"/s.png"} className="img" alt="arrow" />
        </span>
      </button>
      {/* ДОБАВЛЕНО: класс expanded к обертке */}
      <div className={`dropdown-content-wrapper ${isOpen ? "expanded" : ""} ${isDarkMode ? "dark" : ""}`}>
        <div className={`dropdown-content ${isOpen ? "show" : ""} ${isDarkMode ? "dark" : ""}`}>
          <a href="#!" onClick={() => handleSelection("Класс", "/sorting/class")}>
            Класс
          </a>
          <hr className={`hr ${isDarkMode ? "dark" : ""}`} />
          <a
            href="#!"
            onClick={() => handleSelection("Учитель", "/sorting/teacher")}
          >
            Учитель
          </a>
        </div>
      </div>
    </div>
  );
};
