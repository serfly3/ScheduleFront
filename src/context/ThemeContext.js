'use client'
import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Функция для определения системной темы
    const getSystemTheme = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // Функция для обновления темы
    const updateTheme = () => {
      const savedTheme = localStorage.getItem('darkMode');
      
      if (savedTheme !== null) {
        // Если тема сохранена в localStorage, используем её
        setIsDarkMode(savedTheme === 'true');
      } else {
        // Иначе используем системную тему
        const systemIsDark = getSystemTheme();
        setIsDarkMode(systemIsDark);
      }
    };

    // Слушатель изменений системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Обработчик изменений системной темы
    const handleSystemThemeChange = (e) => {
      const savedTheme = localStorage.getItem('darkMode');
      // Обновляем тему только если пользователь не выбрал тему вручную
      if (savedTheme === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Инициализация темы
    updateTheme();

    // Добавляем слушатель изменений системной темы
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Очистка при размонтировании
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  // Функция для сброса к системной теме
  const resetToSystemTheme = () => {
    localStorage.removeItem('darkMode');
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemIsDark);
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme,
      resetToSystemTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;