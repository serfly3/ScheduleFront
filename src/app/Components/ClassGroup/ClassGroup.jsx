"use client";
import Style from "./ClassGroup.module.css";
import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import ApiService from "../../../../services/api";

export const ClassGroup9 = ({ numb }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Используем ApiService для получения списка классов
        const data = await ApiService.getClassesList();
        
        if (data.success && data.classes) {
          setClasses(data.classes);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке классов:", error);
        setError(error.message);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
  }, [classes, numb]);

  // Фильтрация для 9-х классов с проверкой на пробел
  const filteredClasses = classes.filter((classItem) => {
    if (!classItem || !classItem.originalName) {
      return false;
    }

    const className = classItem.originalName.toString().trim();

    // Проверяем, начинается ли класс с нужной цифры
    const startsWithNumber = className.startsWith(numb.toString());

    // Для ClassGroup9 проверяем, что второй символ - пробел (для классов 1-9)
    const hasSpace = className.length >= 2 && className[1] === " ";

    return startsWithNumber && hasSpace;
  });

  const getClassUrl = (classItem) => {
    if (!classItem || !classItem.name) return "";
    
    // Используем name из API, который уже в правильном формате (например "1A", "2B")
    const classWithoutSpace = classItem.name;
    
    // Если класс без буквы (например "11"), добавляем "A"
    if (/^\d+$/.test(classWithoutSpace)) {
      return `/sorting/class/${classWithoutSpace}A`;
    }
    
    return `/sorting/class/${classWithoutSpace}`;
  };

  if (loading) {
    return (
      <div>
        <p className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`}>
          Загрузка {numb} классов...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`}>
          {error === 'Failed to fetch' ? 'Не удалось подключиться к серверу' : `Ошибка загрузки: ${error}` }
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        {filteredClasses.length > 0 ? (
          <ul className={`${Style["ull"]} ${isDarkMode ? Style["dark"] : ""}`}>
            {filteredClasses.map((classItem, index) => (
              <Link
                key={classItem.index || index}
                href={getClassUrl(classItem)}
                style={{ display: "block", margin: "5px 0" }}
              >
                <li
                  className={`${Style["element"]} ${
                    isDarkMode ? Style["dark"] : ""
                  }`}
                >
                  {classItem.originalName}
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p
            className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`}
          >
            {numb} классы не найдены
          </p>
        )}
      </div>
    </div>
  );
};

export const ClassGroup11 = ({ numb }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        // Используем ApiService для получения списка классов
        const data = await ApiService.getClassesList();
        
        if (data.success && data.classes) {
          setClasses(data.classes);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке классов:", error);
        setError(error.message);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    console.log("Classes loaded:", classes.length);
  }, [classes, numb]);

  // Фильтрация для 10-11 классов (без проверки на пробел)
  const filteredClasses = classes.filter((classItem) => {
    if (!classItem || !classItem.originalName) return false;

    const className = classItem.originalName.toString().trim();
    const startsWithNumber = className.startsWith(numb.toString());

    return startsWithNumber;
  });

  const getClassUrl = (classItem) => {
    if (!classItem || !classItem.name) return "";
    
    // Используем name из API, который уже в правильном формате
    const classWithoutSpace = classItem.name;
    
    // Если класс без буквы (например "11"), добавляем "A"
    if (/^\d+$/.test(classWithoutSpace)) {
      return `/sorting/class/${classWithoutSpace}A`;
    }
    
    return `/sorting/class/${classWithoutSpace}`;
  };

  if (loading) {
    return (
      <div>
        <p className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`}>
          Загрузка {numb} классов...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`}>
          {error === 'Failed to fetch' ? 'Не удалось подключиться к серверу' : `Ошибка загрузки: ${error}` }
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        {filteredClasses.length > 0 ? (
          <ul className={`${Style["ull"]} ${isDarkMode ? Style["dark"] : ""}`}>
            {filteredClasses.map((classItem, index) => (
              <Link
                key={classItem.index || index}
                href={getClassUrl(classItem)}
                style={{ display: "block", margin: "5px 0" }}
              >
                <li
                  className={`${Style["element"]} ${
                    isDarkMode ? Style["dark"] : ""
                  }`}
                >
                  {classItem.originalName}
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p
            className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`}
          >
            {numb} классы не найдены
          </p>
        )}
      </div>
    </div>
  );
};