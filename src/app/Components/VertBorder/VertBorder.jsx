"use client";
import React, { useState, useEffect, useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import './VertBorder.css'

export const VertBorder = ({ isListOpen }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return <div className={`vertborder ${isDarkMode ? "dark" : ""} ${isListOpen ? "shifted" : ""}`}></div>;
};