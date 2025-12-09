// lessons.js
let lessons = [];

// Функция для принудительного обновления данных из localStorage
export const refreshLessons = () => {
    if (typeof window !== 'undefined') {
        const storedLessons = localStorage.getItem('lessons');
        lessons = storedLessons ? JSON.parse(storedLessons) : [];
    }
    return lessons;
};

export const setLessons = (data) => {
    lessons = data;
    if (typeof window !== 'undefined') {
        localStorage.setItem('lessons', JSON.stringify(data));
    }
};

export const getLessons = () => {
    // Всегда обновляем данные из localStorage
    if (typeof window !== 'undefined') {
        const storedLessons = localStorage.getItem('lessons');
        lessons = storedLessons ? JSON.parse(storedLessons) : [];
    }
    return lessons;
};