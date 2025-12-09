"use client";
import React, { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import "./Footer.css";
import Link from "next/link";
import LastUpdate from "../LastUpdate/LastUpdate";

export const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className={`footer ${isDarkMode ? "dark" : ""}`}>
      <div className="cont2">
        <div className="cont1">
          <h1 className={`ttll ${isDarkMode ? "dark" : ""}`}>
            Расписание занятий
          </h1>
          <h1 className={`school ${isDarkMode ? "dark" : ""}`}>
            МБОУ "Шалинская СОШ №45"
          </h1>
        </div>
        <Link href={"/"}>
          <img src="/logo.png" className={`logo ${isDarkMode ? "dark" : ""}`} />
        </Link>
      </div>
      <div className="cont44">
        <div className="cont33">
          <div className="goodLinks">
            <p>
              Сайт школы -{" "}
              <a
                href="https://school45-shalya.edusite.ru/p1aa1.html"
                target="_blank"
                className={`linka ${isDarkMode ? "dark" : ""}`}
              >
                {" "}
                Нажмите
              </a>
            </p>
            <p>
              Страница ВК школы -{" "}
              <a
                href="https://vk.com/shalya_school45"
                target="_blank"
                className={`linka ${isDarkMode ? "dark" : ""}`}
              >
                {" "}
                Нажмите
              </a>
            </p>
          </div>
        </div>
        <div className={`reoprtError ${isDarkMode ? "dark" : ""}`}>
          <p>СООБЩИТЬ ОБ ОШИБКЕ</p>
          <p>
            Если вы обнаружили ошибку в работе сайта, пожалуйста напишите в{" "}
            <a
              href="https://vk.com/serflyyy"
              target="_blank"
              className={`linka ${isDarkMode ? "dark" : ""}`}
            >
              ВК (@serflyyy)
            </a>{" "}
            или{" "}
            <a
              href="https://t.me/serflyyy"
              target="_blank"
              className={`linka ${isDarkMode ? "dark" : ""}`}
            >
              Telegram (@serflyyy)
            </a>
            , отправьте скриншоты и описание проблемы.
          </p>
        </div>
      </div>
      <p className={`yrs ${isDarkMode ? "dark" : ""}`}>
        <LastUpdate></LastUpdate>
      </p>
    </div>
  );
};
