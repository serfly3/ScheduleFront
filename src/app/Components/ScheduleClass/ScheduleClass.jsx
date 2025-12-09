"use client";
import React, { useEffect, useContext, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import Style from "./ScheduleClass.module.css";
import LastUpdate from "../LastUpdate/LastUpdate";
import Back from "../Back/Back";
import ApiService from "../../../../services/api";
import { NotFound } from "../NotFound/NotFound";

const ScheduleClass = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [noLessons, setNoLessons] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Состояния для работы с неделями
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loadingWeek, setLoadingWeek] = useState(false);

  // Функция для загрузки текущей недели
  const fetchCurrentWeek = async () => {
    try {
      setLoadingWeek(true);
      
      // Получаем информацию о текущей неделе
      const info = await ApiService.getLastUpdate();
      
      if (info.success && info.weekInfo) {
        setCurrentWeek(info.weekInfo);
      } else {
        // Пробуем получить список недель
        const weeksResult = await ApiService.getWeeks();
        if (weeksResult.success && weeksResult.currentWeek) {
          // Находим текущую неделю в списке
          const currentWeekData = weeksResult.weeks?.find(
            w => w.id === weeksResult.currentWeek
          );
          if (currentWeekData) {
            setCurrentWeek(currentWeekData);
          }
        }
      }
    } catch (err) {
      console.error("Ошибка при загрузке информации о неделе:", err);
    } finally {
      setLoadingWeek(false);
    }
  };

  // Функция для загрузки расписания класса
  const fetchClassSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setNoLessons(false);

      console.log(`Загружаем расписание для класса: ${className}`);

      // Получаем расписание класса с сервера
      const result = await ApiService.getClassSchedule(className);

      console.log("Ответ от сервера:", result);

      if (result.success) {
        if (result.schedule) {
          setScheduleData(result);
          setNotFound(false);

          // Проверяем, есть ли реальные уроки
          const hasAnyLessons = checkIfAnyLessonsExist(result.schedule);
          if (!hasAnyLessons) {
            setNoLessons(true);
          }
        } else {
          setError("Расписание не найдено в ответе сервера");
        }

        // Также получаем информацию о последнем обновлении
        try {
          const info = await ApiService.getLastUpdate();
          if (info.success && info.lastModified) {
            setLastUpdate(info.lastModified);
          }
        } catch (infoError) {
          console.warn("Не удалось получить информацию о файле:", infoError);
        }
      } else {
        // Проверяем, является ли это ошибкой 404
        if (result.error && result.error.includes("не найден")) {
          setNotFound(true);
        } else {
          setError(result.error || "Расписание не найдено");
        }
      }
    } catch (err) {
      console.error("Ошибка при загрузке расписания:", err);

      // Проверяем, является ли это ошибкой 404
      if (
        err.message &&
        (err.message.includes("404") ||
          err.message.includes("не найден") ||
          err.message.includes("Not Found"))
      ) {
        setNotFound(true);
      } else {
        setError(err.message || "Ошибка при загрузке расписания");
      }
    } finally {
      setLoading(false);
    }
  };

  // Функция для проверки, есть ли реальные уроки в расписании
  const checkIfAnyLessonsExist = (schedule) => {
    if (!schedule) return false;

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

    for (const day of days) {
      const daySchedule = schedule[day];
      if (daySchedule && Array.isArray(daySchedule)) {
        const hasRealLesson = daySchedule.some(
          (lesson) => lesson.subject && lesson.subject !== "0"
        );
        if (hasRealLesson) {
          return true;
        }
      }
    }

    return false;
  };

  // Функция для обработки успешной загрузки файла
  const handleFileUploadSuccess = () => {
    // После успешной загрузки файла перезагружаем расписание и информацию о неделе
    fetchClassSchedule();
    fetchCurrentWeek();
  };

  useEffect(() => {
    fetchClassSchedule();
    fetchCurrentWeek();
  }, [className]); // Загружаем заново при изменении className

  // Функция для конвертации имени класса
  const convertClassNameToRussian = (className) => {
    if (!className) return "";

    const match = className.match(/^(\d+)([A-Za-z])?$/);
    if (match) {
      const digit = match[1];
      const letter = match[2] || "";

      const classMap = {
        A: "А",
        B: "Б",
        V: "В",
        G: "Г",
        K: "К",
        C: "К",
        D: "Д",
        E: "Е",
        F: "Ф",
      };

      const russianLetter = classMap[letter.toUpperCase()] || letter;
      return `${digit}${russianLetter ? " " + russianLetter : ""}`;
    }

    return className;
  };

  // Функция для форматирования имени учителя
  const formatTeacherName = (teacher) => {
    if (!teacher || teacher === "0") return null;

    if (typeof teacher === "string") {
      const teacherParts = teacher.split(",").map((t) => {
        const teacherName = t.trim().split(" ");
        const lastName = teacherName[0];
        const initials = teacherName
          .slice(1)
          .map((name) => name.charAt(0) + ".")
          .join(" ");
        return `🧑‍🏫 ${lastName} ${initials}`;
      });
      return teacherParts.join(" | ");
    }

    return null;
  };

  // Функция для отображения кабинета
  const formatRoom = (room) => {
    if (!room || room === "0") return null;
    return `📍 ${room}`;
  };

  // Проверяем, есть ли реальные уроки в массиве дня
  const hasRealLessons = (daySchedule) => {
    if (!daySchedule || !Array.isArray(daySchedule)) return false;
    return daySchedule.some(
      (lesson) => lesson.subject && lesson.subject !== "0"
    );
  };

  // Компонент отображения текущей недели
  const CurrentWeekDisplay = () => {
    if (loadingWeek) {
      return (
        <div className={`${Style.currentWeekDisplay} ${isDarkMode ? Style.dark : ""}`}>
          <p>Загрузка информации о неделе...</p>
        </div>
      );
    }

    if (!currentWeek) {
      return null; // Не показываем, если нет информации о неделе
    }

    return (
      <div className={`${Style.currentWeekDisplay} ${isDarkMode ? Style.dark : ""}`}>
        <div className={Style.weekInfoContent}>
          <div className={Style.weekText}>
            {currentWeek.title}
          </div>
        </div>
      </div>
    );
  };

  // ============ РЕНДЕРИНГ ============

  // Если страница не найдена (404)
  if (notFound) {
    return (
      <div
        className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}
      >
        <ScheduleUploader onUploadSuccess={handleFileUploadSuccess} />
        <CurrentWeekDisplay />
        <NotFound
          typePage="расписание"
          additionalMessage={`Класс ${convertClassNameToRussian(
            className
          )} не найден`}
        />
      </div>
    );
  }

  // Если нет уроков вообще
  if (noLessons) {
    return (
      <div
        className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}
      >
        <ScheduleUploader onUploadSuccess={handleFileUploadSuccess} />
        <CurrentWeekDisplay />
        <NotFound
          typePage="расписание"
          additionalMessage={`Расписание для класса ${convertClassNameToRussian(
            className
          )} отсутствует или пустое`}
          suggestions={[
            "Файл расписания может быть пустым",
            "Для этого класса могут не быть назначены уроки",
            "Попробуйте загрузить другой файл с расписанием",
          ]}
        />
      </div>
    );
  }

  // Если загрузка
  if (loading) {
    return (
      <div
        className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}
      >
        <CurrentWeekDisplay />
        <div className={Style.loadingContainer}>
          <div className={Style.spinner}></div>
          <p>Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  // Если другая ошибка (не 404)
  if (error) {
    return (
      <div
        className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}
      >
        <CurrentWeekDisplay />
        <div className={Style.errorContainer}>
          <p className={Style.errorMessage}>
            Ошибка:{" "}
            {error === "Failed to fetch"
              ? "Не удалось подключиться к серверу"
              : error}
          </p>
          <button
            onClick={fetchClassSchedule}
            className={`${Style.retryButton} ${isDarkMode ? Style.dark : ""}`}
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  // Если нет расписания (но не ошибка 404)
  if (!scheduleData || !scheduleData.schedule) {
    return (
      <div
        className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}
      >
        <CurrentWeekDisplay />
        <div className={Style.noScheduleContainer}>
          <p>Расписание для этого класса отсутствует</p>
        </div>
      </div>
    );
  }

  const daysOfWeekInRussian = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
  ];

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  return (
    <div
      className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}
    >
      {/* Контейнер для Back и LastUpdate */}
      <div className={Style.headerContainer}>
        <div className={Style.backContainer}>
          <Back />
        </div>
        <div className={Style.lastUpdateContainer}>
          <LastUpdate date={lastUpdate} />
        </div>
        <div className={Style.emptySpace}></div>
      </div>
            <CurrentWeekDisplay />


      <h1 className={`${Style.classNameTitle} ${isDarkMode ? Style.dark : ""}`}>
        {convertClassNameToRussian(scheduleData.className || className)}
      </h1>

      {daysOfWeekInRussian.map((dayName, dayIndex) => {
        const dayKey = daysOfWeek[dayIndex];
        const daySchedule = scheduleData.schedule[dayKey];

        if (!daySchedule || !hasRealLessons(daySchedule)) {
          return null;
        }

        return (
          <div
            key={dayKey}
            className={`${Style.dayContainer} ${isDarkMode ? Style.dark : ""}`}
          >
            <h2
              className={`${Style.dayOfWeek} ${isDarkMode ? Style.dark : ""}`}
            >
              {dayName}
            </h2>
            <div className={Style.lessonsWrapper}>
              {daySchedule.map((lessonObj, index) => {
                if (!lessonObj.subject || lessonObj.subject === "0") {
                  return null;
                }

                const nextLessons = daySchedule.slice(index + 1);
                const hasNextLesson = nextLessons.some(
                  (nextLesson) =>
                    nextLesson.subject && nextLesson.subject !== "0"
                );

                return (
                  <div
                    key={`${dayKey}-${index}`}
                    className={`${Style.lesson} ${
                      isDarkMode ? Style.dark : ""
                    }`}
                  >
                    <h3
                      className={`${Style.numb} ${
                        isDarkMode ? Style.dark : ""
                      }`}
                    >
                      {lessonObj.lessonNumber} урок
                    </h3>
                    <p
                      className={`${Style.less} ${
                        isDarkMode ? Style.dark : ""
                      }`}
                    >
                      {lessonObj.subject}
                    </p>

                    {lessonObj.teacher && lessonObj.teacher !== "0" && (
                      <p
                        className={`${Style.teach} ${
                          isDarkMode ? Style.dark : ""
                        }`}
                      >
                        {formatTeacherName(lessonObj.teacher)}
                      </p>
                    )}

                    {lessonObj.room && lessonObj.room !== "0" && (
                      <p
                        className={`${Style.room} ${
                          isDarkMode ? Style.dark : ""
                        }`}
                      >
                        {formatRoom(lessonObj.room)}
                      </p>
                    )}

                    {hasNextLesson && (
                      <hr className={isDarkMode ? Style.dark : ""} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleClass;