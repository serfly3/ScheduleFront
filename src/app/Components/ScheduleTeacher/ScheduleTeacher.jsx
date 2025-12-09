"use client";
import React, { useEffect, useContext, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import Style from "./ScheduleTeacher.module.css";
import { NotFound } from "../NotFound/NotFound";
import LastUpdate from "../LastUpdate/LastUpdate";
import Back from "../Back/Back";
import ApiService from "../../../../services/api";

const ScheduleTeacher = ({ teacherName }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [teacherSchedule, setTeacherSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [decodedTeacherName, setDecodedTeacherName] = useState("");
  
  // Состояния для работы с неделями (как в ScheduleClass)
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loadingWeek, setLoadingWeek] = useState(false);

  // Функция для загрузки расписания учителя
  const fetchTeacherSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);
      
      const decodedName = decodeURIComponent(teacherName);
      setDecodedTeacherName(decodedName);
      
      // Получаем расписание учителя с сервера
      const result = await ApiService.getTeacherSchedule(decodedName);
      
      if (result.success && result.schedule) {
        setTeacherSchedule({
          teacher: result.teacher,
          lessons: formatLessonsFromApi(result.schedule)
        });
        setNotFound(false);
        
        // Также получаем информацию о последнем обновлении
        try {
          const info = await ApiService.getFileInfo();
          if (info.success && info.fileInfo) {
            setLastUpdate(info.fileInfo.lastModified);
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
      console.error("Ошибка при загрузке расписания учителя:", err);
      
      // Проверяем, является ли это ошибкой 404
      if (err.message && (
        err.message.includes("404") || 
        err.message.includes("не найден") ||
        err.message.includes("Not Found")
      )) {
        setNotFound(true);
      } else {
        setError(err.message || "Ошибка при загрузке расписания");
      }
    } finally {
      setLoading(false);
    }
  };

  // Функция для загрузки текущей недели (как в ScheduleClass)
  const fetchCurrentWeek = async () => {
    try {
      setLoadingWeek(true);
      
      // Получаем информацию о текущей неделе (используем тот же метод, что и в ScheduleClass)
      const info = await ApiService.getLastUpdate();
      
      if (info.success && info.weekInfo) {
        setCurrentWeek(info.weekInfo);
      } else {
        // Пробуем получить список недель
        try {
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
        } catch (weeksError) {
          console.warn("Не удалось получить информацию о неделях:", weeksError);
        }
      }
    } catch (err) {
      console.error("Ошибка при загрузке информации о неделе:", err);
    } finally {
      setLoadingWeek(false);
    }
  };

  // Функция для преобразования данных из API в формат компонента
  const formatLessonsFromApi = (scheduleData) => {
    const lessons = [];
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    
    days.forEach(day => {
      const dayLessons = scheduleData[day] || [];
      dayLessons.forEach(lesson => {
        lessons.push({
          day: day,
          lesson: lesson.lessonNumber,
          lessonName: lesson.subject,
          room: lesson.room,
          className: lesson.className
        });
      });
    });
    
    return lessons;
  };

  // Функция для обработки успешной загрузки файла
  const handleFileUploadSuccess = () => {
    // После успешной загрузки файла перезагружаем расписание и информацию о неделе
    fetchTeacherSchedule();
    fetchCurrentWeek();
  };

  useEffect(() => {
    fetchTeacherSchedule();
    fetchCurrentWeek();
  }, [teacherName]);

  // Функция для преобразования латинской буквы класса в русскую
  const convertClassLetterToRussian = (className) => {
    if (!className) return "";
    
    const classLetterMap = {
      'A': 'А',
      'B': 'Б',
      'V': 'В',
      'G': 'Г',
      'K': 'К',
      'C': 'К',
      'D': 'Д',
      'E': 'Е',
      'F': 'Ф',
    };

    // Разделяем цифры и буквы
    const match = className.match(/^(\d+)([A-Za-z])?$/);
    if (match) {
      const digit = match[1];
      const letter = match[2] || '';
      
      const russianLetter = classLetterMap[letter.toUpperCase()] || letter;
      return `${digit}${russianLetter ? russianLetter : ''}`;
    }
    
    return className;
  };

  // Функция для форматирования имени учителя
  const formatTeacherName = (teacher) => {
    if (!teacher) return "";
    
    // Разделяем имя на части
    const teacherParts = teacher.split(" ");
    if (teacherParts.length === 0) return teacher;
    
    const lastName = teacherParts[0];
    
    // Если есть инициалы в формате "И.О." или "И О"
    if (teacherParts.length > 1) {
      const initials = teacherParts
        .slice(1)
        .map(name => {
          // Если это инициал с точкой или без
          if (name.length <= 2) {
            return name.endsWith('.') ? name : name + '.';
          }
          // Если это полное имя, берем первую букву
          return name.charAt(0) + '.';
        })
        .join(" ");
      
      return `${lastName} ${initials}`;
    }
    
    return lastName;
  };

  // Компонент для отображения текущей недели (как в ScheduleClass)
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
      <div className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}>
        <CurrentWeekDisplay />
        <NotFound 
          typePage="расписание" 
          additionalMessage={`Учитель ${formatTeacherName(decodedTeacherName)} не найден`}
        />
      </div>
    );
  }

  // Если загрузка
  if (loading) {
    return (
      <div className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}>
        <CurrentWeekDisplay />
        <div className={Style.loadingContainer}>
          <div className={Style.spinner}></div>
        </div>
      </div>
    );
  }

  // Если другая ошибка (не 404)
  if (error) {
    return (
      <div className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}>
        <CurrentWeekDisplay />
        <div className={Style.errorContainer}>
          <p className={Style.errorMessage}>Ошибка: {error === "Failed to fetch"? 'Не удалось подключиться к серверу' : error}</p>
          <button 
            onClick={fetchTeacherSchedule}
            className={`${Style.retryButton} ${isDarkMode ? Style.dark : ""}`}
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  // Если нет расписания (но не ошибка 404)
  if (!teacherSchedule || !teacherSchedule.lessons || teacherSchedule.lessons.length === 0) {
    return (
      <div className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}>
        <CurrentWeekDisplay />
        <div className={Style.noScheduleContainer}>
          <h1 className={`${Style.teacherNameTitle} ${isDarkMode ? Style.dark : ""}`}>
            {formatTeacherName(decodedTeacherName)}
          </h1>
          <p>Расписание для этого учителя отсутствует</p>
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
    <div className={`${Style.scheduleContainer} ${isDarkMode ? Style.dark : ""}`}>
      
      {/* Контейнер для Back и LastUpdate */}
      <div className={Style.headerContainer}>
        <div className={Style.backContainer}>
          <Back />
        </div>
        <div className={Style.lastUpdateContainer}>
          <LastUpdate date={lastUpdate} />
        </div>
        {/* Пустой div для выравнивания (занимает место как Back) */}
        <div className={Style.emptySpace}></div>
      </div>
      
      {/* Отображение текущей недели */}
      <CurrentWeekDisplay />
      
      <h1 className={`${Style.teacherNameTitle} ${isDarkMode ? Style.dark : ""}`}>
        {formatTeacherName(teacherSchedule.teacher || decodedTeacherName)}
      </h1>
      
      {daysOfWeekInRussian.map((day, dayIndex) => {
        // Фильтруем уроки по дню
        const dayLessons = teacherSchedule.lessons.filter(
          lesson => lesson.day === daysOfWeek[dayIndex]
        );
        
        // Группируем уроки по номеру урока
        const lessonsByNumber = {};
        
        dayLessons.forEach(lesson => {
          const lessonNumber = lesson.lesson;
          if (!lessonsByNumber[lessonNumber]) {
            lessonsByNumber[lessonNumber] = [];
          }
          lessonsByNumber[lessonNumber].push({
            lesson: lesson.lessonName,
            room: lesson.room,
            number: lesson.lesson,
            className: convertClassLetterToRussian(lesson.className),
          });
        });

        // Преобразуем объект в массив и сортируем по номеру урока
        const groupedLessons = Object.keys(lessonsByNumber)
          .sort((a, b) => a - b)
          .map(number => ({
            number: parseInt(number),
            lessons: lessonsByNumber[number]
          }));

        // Если нет уроков на этот день, не отображаем
        if (groupedLessons.length === 0) {
          return null;
        }

        return (
          <div
            key={day}
            className={`${Style.dayContainer} ${isDarkMode ? Style.dark : ""}`}
          >
            <h2 className={`${Style.dayOfWeek} ${isDarkMode ? Style.dark : ""}`}>
              {day}
            </h2>
            
            <div className={Style.lessonsWrapper}>
              {groupedLessons.map((group, groupIndex) => (
                <div
                  key={`${day}-${group.number}`}
                  className={`${Style.lessonGroup} ${isDarkMode ? Style.dark : ""}`}
                >
                  <h3 className={`${Style.numb} ${isDarkMode ? Style.dark : ""}`}>
                    {group.number} урок
                  </h3>
                  
                  <div className={Style.lessonsContainer}>
                    {group.lessons.map((lessonObj, lessonIndex) => (
                      <div 
                        key={`${day}-${group.number}-${lessonIndex}`}
                        className={`${Style.lessonItem} ${isDarkMode ? Style.dark : ""}`}
                      >
                        <p className={`${Style.less} ${isDarkMode ? Style.dark : ""}`}>
                          {lessonObj.lesson} {lessonObj.className && `| ${lessonObj.className}`}
                        </p>
                        
                        {lessonObj.room && (
                          <p className={`${Style.room} ${isDarkMode ? Style.dark : ""}`}>
                            📍 {lessonObj.room}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Добавляем разделитель только между разными уроками */}
                  {groupIndex < groupedLessons.length - 1 && (
                    <hr className={isDarkMode ? Style.dark : ""} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleTeacher;