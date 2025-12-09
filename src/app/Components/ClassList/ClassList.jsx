"use client";
import { ClassGroup9, ClassGroup11 } from "../ClassGroup/ClassGroup";
import Style from "./ClassList.module.css";
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";

export const ClassList = ({ isListOpen }) => { // Добавлен пропс isListOpen
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className={`${Style["container"]} ${isListOpen ? Style["shifted"] : ""} ${isDarkMode ? Style["dark"] : ""}`}>
      <ClassGroup9 numb="1"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="2"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="3"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="4"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="5"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="6"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="7"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="8"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup9 numb="9"></ClassGroup9>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup11 numb="10"></ClassGroup11>
      <hr className={`${Style["hr"]} ${isDarkMode ? Style["dark"] : ""}`} />
      <ClassGroup11 numb="11"></ClassGroup11>
    </div>
  );
};