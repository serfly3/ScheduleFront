let callsSchedule = [];

// Функция для установки данных
export const setCalls = (data) => {
  callsSchedule = data;
  if (typeof window !== 'undefined') {
    localStorage.setItem('callsSchedule', JSON.stringify(data)); // Сохраняем данные в localStorage
  }
};

// Функция для получения данных
export const getCalls = () => {
  return callsSchedule;
};
