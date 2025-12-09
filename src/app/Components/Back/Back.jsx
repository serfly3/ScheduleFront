"use client";
import React, { useState, useContext, useEffect } from "react";
import Style from "./Back.module.css";
import ThemeContext from "@/context/ThemeContext";

const Back = ({ children = "◀️ Назад", className = "back-button", onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (!e.defaultPrevented && window.history.length > 1) {
      window.history.back();
    }
  };
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <button className={`${Style["back"]} ${isDarkMode ? Style["dark"] : ""}`} onClick={handleClick} type="button">
      {children}
    </button>
  );
};

export default Back;
