import React, { createContext, useContext, useState, useEffect } from "react";
import * as XLSX from "xlsx";

// Создаем контексты
const TeachersContext = createContext([]);
const ClassesContext = createContext([]);

// Общий провайдер для учителей и классов
export const DataProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  // Функция для чтения Excel файла
  const fetchData = async () => {
    try {
      const response = await fetch("/schedule.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = "Списки";
      const sheet = wb.Sheets[sheetName];

      if (!sheet) {
        alert('Лист с названием "Списки" не найден!');
        return { teachers: [], classes: [] };
      }

      // Получаем данные как массив массивов, чтобы видеть структуру
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Ищем колонки с учителями и классами
      let teachersColumnIndex = -1;
      let classesColumnIndex = -1;

      // Ищем заголовки в первой строке
      if (rawData.length > 0) {
        const headers = rawData[0];
        teachersColumnIndex = headers.findIndex(header => 
          header && header.toString().includes('УЧИТЕЛЕЙ')
        );
        classesColumnIndex = headers.findIndex(header => 
          header && header.toString().includes('КЛАССОВ')
        );
      }

      const teachersData = [];
      const classesData = [];

      // Обрабатываем данные, начиная со второй строки (индекс 1)
      for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        
        // Добавляем учителя, исключаем тех, у кого есть запятая
        if (teachersColumnIndex !== -1 && row[teachersColumnIndex]) {
          const teacherName = row[teachersColumnIndex].toString().trim();
          if (teacherName && !teacherName.includes(',')) { // Проверка на запятую
            teachersData.push({
              name: teacherName,
              index: teachersData.length + 1
            });
          }
        }
        
        // Добавляем класс
        if (classesColumnIndex !== -1 && row[classesColumnIndex]) {
          const className = row[classesColumnIndex].toString().trim();
          if (className) {
            classesData.push({
              name: className,
              index: classesData.length + 1
            });
          }
        }
      }

      return { teachers: teachersData, classes: classesData };

    } catch (error) {
      return { teachers: [], classes: [] };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const { teachers: teachersData, classes: classesData } = await fetchData();
      setTeachers(teachersData);
      setClasses(classesData);
    };

    loadData();
  }, []);

  return (
    <TeachersContext.Provider value={teachers}>
      <ClassesContext.Provider value={classes}>
        {children}
      </ClassesContext.Provider>
    </TeachersContext.Provider>
  );
};

// Хуки для использования данных
export const useTeachers = () => useContext(TeachersContext);
export const useClasses = () => useContext(ClassesContext);
