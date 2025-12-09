"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import Style from "./LastUpdate.module.css";
import ThemeContext from "@/context/ThemeContext";
import ApiService from "../../../../services/api";

const LastUpdate = () => {
  const [lastModified, setLastModified] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [relativeTime, setRelativeTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);
  const mountedRef = useRef(true);

  // Функция для форматирования даты
  const formatDate = (date) => {
    if (!date) return "";
    
    try {
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      // Форматируем относительное время
      let relative = "";
      if (diffMins < 1) {
        relative = "только что";
      } else if (diffMins < 60) {
        relative = `${diffMins} ${getRussianWord(diffMins, ["минуту", "минуты", "минут"])} назад`;
      } else if (diffHours < 24) {
        relative = `${diffHours} ${getRussianWord(diffHours, ["час", "часа", "часов"])} назад`;
      } else if (diffDays < 7) {
        relative = `${diffDays} ${getRussianWord(diffDays, ["день", "дня", "дней"])} назад`;
      } else {
        relative = `${Math.floor(diffDays / 7)} ${getRussianWord(Math.floor(diffDays / 7), ["неделю", "недели", "недель"])} назад`;
      }
      
      // Форматируем полную дату
      const dateTime = date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      
      return {
        dateTime,
        relative,
        raw: date
      };
    } catch (err) {
      console.error("Ошибка форматирования даты:", err);
      return {
        dateTime: date.toISOString().split('T')[0],
        relative: "",
        raw: date
      };
    }
  };

  // Функция для склонения русских слов
  const getRussianWord = (number, words) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };

  const getLastUpdate = async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Получаем данные об обновлении
      const data = await ApiService.getLastUpdate();
      

      if (data.success) {
        if (data.exists && data.lastModified) {
          // Парсим дату с сервера
          let date;
          if (typeof data.lastModified === 'string') {
            date = new Date(data.lastModified);
          } else if (data.timestamp) {
            date = new Date(data.timestamp);
          } else if (data.fileInfo?.lastModified) {
            date = new Date(data.fileInfo.lastModified);
          }
          
          if (date && !isNaN(date.getTime())) {
            setLastModified(date);
            
            // Форматируем дату на клиенте
            const formatted = formatDate(date);
            setFormattedDate(formatted.dateTime);
            setRelativeTime(formatted.relative);
            setFileInfo(data);
          } else {
            // Если дата не пришла, используем текущую
            const now = new Date();
            setLastModified(now);
            const formatted = formatDate(now);
            setFormattedDate(formatted.dateTime);
            setRelativeTime(formatted.relative);
          }
        } else if (!data.exists) {
          // Файл не существует
          setLastModified(null);
          setFormattedDate("");
          setRelativeTime("");
          setFileInfo(data);
        }
      } else {
        setError(data.error || "Ошибка при получении данных");
        setLastModified(null);
        setFormattedDate("");
      }
    } catch (err) {
      console.error("Ошибка при получении даты обновления:", err);
      setError(err.message || "Ошибка сети");
      setLastModified(null);
      setFormattedDate("");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    getLastUpdate();

    // Обновляем информацию каждые 60 секунд
    const intervalId = setInterval(() => {
      if (mountedRef.current) {
        getLastUpdate();
      }
    }, 60000);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  // Режим по умолчанию - блоковый (div)
  const renderBlockContent = () => {
    // Если загрузка
    if (loading) {
      return (
        <div
          className={`${Style.lastUpdate} ${Style.loading} ${
            isDarkMode ? Style.dark : ""
          }`}
        >
          <span className={Style.spinner}></span>
          <span className={Style.loadingText}>Загрузка информации...</span>
        </div>
      );
    }

    // Если ошибка
    if (error) {
      return (
        <div
          className={`${Style.lastUpdate} ${Style.error} ${
            isDarkMode ? Style.dark : ""
          }`}
        >
          <div className={Style.errorContent}>
            <span className={Style.errorIcon}>⚠️</span>
            <div className={Style.errorText}>
              <div className={Style.errorMessage}>{error === "Failed to fetch" ? 'Нет подключения к серверу': error}</div>
            </div>
            <button
              onClick={getLastUpdate}
              className={Style.retryButton}
              title="Повторить попытку"
            >
              🔄
            </button>
          </div>
        </div>
      );
    }

    // Если файл не найден
    if (!lastModified && fileInfo && !fileInfo.exists) {
      return (
        <div
          className={`${Style.lastUpdate} ${Style.notFound} ${
            isDarkMode ? Style.dark : ""
          }`}
        >
          <span className={Style.notFoundIcon}></span>
          <span className={Style.notFoundText}>
            На сервере нет расписания ☹️
          </span>
          <button
            onClick={getLastUpdate}
            className={Style.retryButton}
            title="Проверить снова"
          >
            🔄
          </button>
        </div>
      );
    }

    // Если данные есть
    if (lastModified) {
      return (
        <div className={`${Style.lastUpdate} ${isDarkMode ? Style.dark : ""}`}>
          <div className={Style.updateInfo}>
            <span className={Style.icon}>🕒</span>
            <div className={Style.textContainer}>
              <div className={Style.mainText}>
                {fileInfo && fileInfo.fileSize ? (
                  <>
                    Обновлено: {formattedDate}
                  </>
                ) : (
                  `Обновлено: ${formattedDate}`
                )}
              </div>
              {relativeTime && (
                <div className={Style.relativeTime}>{relativeTime}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // По умолчанию (если нет данных)
    return (
      <div
        className={`${Style.lastUpdate} ${Style.noData} ${
          isDarkMode ? Style.dark : ""
        }`}
      >
        <span className={Style.noDataIcon}>❓</span>
        <span className={Style.noDataText}>Нет данных о последнем обновлении</span>
        <button
          onClick={getLastUpdate}
          className={Style.retryButton}
          title="Проверить"
        >
          🔄
        </button>
      </div>
    );
  };

  // Вспомогательная функция для форматирования размера файла
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return renderBlockContent();
};

// Альтернативная версия компонента для встраивания в inline-элементы
export const LastUpdateInline = (props) => {
  return (
    <span className={Style.inlineUpdate}>
      <LastUpdate {...props} />
    </span>
  );
};

LastUpdate.Inline = LastUpdateInline;

export default LastUpdate;