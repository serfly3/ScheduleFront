const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiService {
  // Базовый метод для запросов с обработкой сессий
  static async fetchWithSession(url, options = {}) {
    try {
      
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // ОБЯЗАТЕЛЬНО для передачи кук
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        }
      });
      
      
      if (!response.ok) {
        // Если 401 - сессия истекла
        if (response.status === 401) {
          // Перенаправляем на страницу входа только если это админка
          if (typeof window !== 'undefined' && window.location.pathname === '/') {
            window.location.href = '/login';
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Требуется авторизация');
        }
        
        // Пробуем получить ошибку из JSON
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (jsonError) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      // Проверяем Content-Type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Если не JSON, возвращаем текст
        return await response.text();
      }
    } catch (error) {
      console.error("❌ Ошибка запроса:", error);
      throw error;
    }
  }

  // Получить расписание конкретного класса
  static async getClassSchedule(className) {
    return await this.fetchWithSession(
      `${API_BASE_URL}/schedule/class/${encodeURIComponent(className)}`
    );
  }

  // Получить расписание конкретного учителя
  static async getTeacherSchedule(teacherName) {
    return await this.fetchWithSession(
      `${API_BASE_URL}/teachers/${encodeURIComponent(teacherName)}`
    );
  }

  // Поиск учителей
  static async searchTeachers(query) {
    return await this.fetchWithSession(
      `${API_BASE_URL}/teachers/search?q=${encodeURIComponent(query)}`
    );
  }

  // Получить список всех учителей
  static async getAllTeachers() {
    return await this.fetchWithSession(`${API_BASE_URL}/teachers/schedule`);
  }

  // Получить все расписание
  static async getAllSchedule() {
    return await this.fetchWithSession(`${API_BASE_URL}/schedule`);
  }

  // Получить информацию о файле
  static async getFileInfo() {
    return await this.fetchWithSession(`${API_BASE_URL}/info`);
  }

  // Загрузить файл (только для авторизованных) - ОСОБАЯ ОБРАБОТКА
  static async uploadFile(file) {
    try {
      
      const formData = new FormData();
      formData.append("excelFile", file);

      // Сначала делаем preflight запрос
      const preflightResponse = await fetch(`${API_BASE_URL}/upload`, {
        method: "OPTIONS",
        credentials: 'include',
      });


      // Основной запрос
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        credentials: 'include', // ОБЯЗАТЕЛЬНО для передачи сессии
        // Не устанавливаем Content-Type для FormData - браузер сделает это сам
      });


      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Требуется авторизация');
        }
        
        // Пробуем получить ошибку
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (jsonError) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Ошибка при загрузке файла:", error);
      throw error;
    }
  }

  // Получить списки учителей и классов
  static async getLists() {
    return await this.fetchWithSession(`${API_BASE_URL}/lists`);
  }

  // Получить только учителей
  static async getTeachersList() {
    return await this.fetchWithSession(`${API_BASE_URL}/teachers/list`);
  }

  // Получить только классы
  static async getClassesList() {
    return await this.fetchWithSession(`${API_BASE_URL}/classes/list`);
  }

  // Проверить здоровье сервера
  static async checkHealth() {
    return await this.fetchWithSession(`${API_BASE_URL}/health`);
  }

  // Получить дату последнего обновления
  static async getLastUpdate() {
    return await this.fetchWithSession(`${API_BASE_URL}/last-update`);
  }

  // Проверить авторизацию (для админки)
  static async checkAuth() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        return { 
          success: false, 
          authenticated: false,
          error: `HTTP ${response.status}`
        };
      }
      
      return await response.json();
    } catch (error) {
      console.error("❌ Ошибка проверки авторизации:", error);
      return { 
        success: false, 
        authenticated: false,
        error: error.message 
      };
    }
  }

  // Вход в систему
  static async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка входа: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Ошибка при входе:", error);
      throw error;
    }
  }

  // Выход из системы (для админки)
  static async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      return await response.json();
    } catch (error) {
      console.error("❌ Ошибка при выходе:", error);
      throw error;
    }
  }
  
}


export default ApiService;
