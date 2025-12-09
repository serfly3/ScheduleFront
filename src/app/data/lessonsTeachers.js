let teachersSchedule = [];

// Проверяем, что код выполняется на клиенте
if (typeof window !== 'undefined') {
    // Получаем данные из localStorage
    const storedSchedule = localStorage.getItem('teachersSchedule');
    teachersSchedule = storedSchedule ? JSON.parse(storedSchedule) : [];
}

// Устанавливаем данные в память и localStorage
export const setTeachersSchedule = (data) => {
    teachersSchedule = data;
    if (typeof window !== 'undefined') {
        // Если данные пустые, очищаем localStorage
        if (data.length === 0) {
            localStorage.removeItem('teachersSchedule'); // Очистим данные в localStorage
        } else {
            // Если данные есть, сохраняем их
            localStorage.setItem('teachersSchedule', JSON.stringify(data)); // Сохраняем данные в localStorage
        }
    }
};

// Получаем данные
export const getTeachersSchedule = () => {
    return teachersSchedule;
};
