'use client';
import { Teacher } from "../Teacher/Teacher";
import Style from './TeachersList.module.css';
import { useContext, useEffect, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import ApiService from "../../../../services/api";

export const TeachersList = ({ isListOpen }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ВРЕМЕННОЕ РЕШЕНИЕ: используем /api/lists вместо /api/teachers/list
        console.log("Используем временное решение через /api/lists...");
        
        try {
          // Пробуем получить списки учителей из /api/lists
          const listsData = await ApiService.getLists();
          console.log("Ответ от /api/lists:", listsData);
          
          if (listsData.success && listsData.teachers) {
            // Преобразуем данные в нужный формат
            const formattedTeachers = listsData.teachers.map(teacher => ({
              name: teacher.name,
              index: teacher.index || 0
            }));
            
            setTeachers(formattedTeachers);
            console.log("Учители получены:", formattedTeachers.length);
          } else {
            throw new Error("Не удалось получить список учителей");
          }
        } catch (listsError) {
          console.error("Ошибка при получении списков:", listsError);
          
          // Резервный вариант: пытаемся получить через /api/teachers/schedule
          try {
            console.log("Пробуем резервный вариант через /api/teachers/schedule...");
            const scheduleData = await ApiService.getAllTeachers();
            console.log("Ответ от /api/teachers/schedule:", scheduleData);
            
            if (scheduleData.success && scheduleData.teachers) {
              const formattedTeachers = scheduleData.teachers.map((teacher, index) => ({
                name: teacher.teacher,
                index: index + 1
              }));
              
              setTeachers(formattedTeachers);
              console.log("Учители получены из расписания:", formattedTeachers.length);
            } else {
              throw new Error("Не удалось получить учителей из расписания");
            }
          } catch (scheduleError) {
            console.error("Ошибка при получении расписания:", scheduleError);
            throw new Error("Не удалось загрузить список учителей");
          }
        }
        
      } catch (error) {
        console.error("Общая ошибка при загрузке учителей:", error);
        setError(error.message);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    if (Array.isArray(teachers) && teachers.length > 0) {
      // Фильтруем учителей, исключая тех, у кого нет имени или имя пустое
      const filteredTeachers = teachers.filter(teacher => {
        const hasName = teacher && teacher.name && teacher.name.toString().trim() !== '';
        return hasName;
      });
            
      // Сортируем отфильтрованных учителей по алфавиту
      const sortedTeachers = filteredTeachers.sort((a, b) => 
        a.name.toString().localeCompare(b.name.toString())
      );
      
      // Добавляем индексы, если их нет
      const teachersWithIndex = sortedTeachers.map((teacher, index) => ({
        ...teacher,
        index: teacher.index || index + 1
      }));
      
      setTeacherList(teachersWithIndex);
    } else {
      setTeacherList([]);
    }
  }, [teachers]);

  if (loading) {
    return (
      <div className={`${Style["container"]} ${isListOpen ? Style["shifted"] : ""} ${isDarkMode ? Style["dark"] : ""}`}>
        <div className={Style["no-teachers"]}>
          <p>Загрузка учителей...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${Style["container"]} ${isListOpen ? Style["shifted"] : ""} ${isDarkMode ? Style["dark"] : ""}`}>
        <div className={`${Style["elementn"]}  ${isDarkMode ? Style["dark"] : ""}`}>
          <p>{error === 'Failed to fetch' ? 'Не удалось подключиться к серверу' : `Ошибка загрузки: ${error}` }</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${Style["container"]} ${isListOpen ? Style["shifted"] : ""} ${isDarkMode ? Style["dark"] : ""}`}>
      {teacherList.length > 0 ? (
        teacherList.map((teacher, index) => (
          <Teacher 
            key={teacher.index || index} 
            name={teacher.name} 
            index={teacher.index} 
          />
        ))
      ) : (
        <div className={`${Style["elementn"]} ${isDarkMode ? Style["dark"] : ""}`} >
          <p>Нет доступных учителей</p>
        </div>
      )}
    </div>
  );
};